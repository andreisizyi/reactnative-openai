// TODO split into components
// TODO set how much request is left

import React, { Component } from 'react';
import { Image, StatusBar, SafeAreaView, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import { throttle } from 'lodash';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from '@expo/vector-icons/Ionicons';

// SplashScreen
SplashScreen.preventAutoHideAsync()

const styles = StyleSheet.create({
  title: {
    color: "#ffffff",
  }
})
const abortController = new AbortController();
const signal = abortController.signal;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appIsReady: 0,
      downloadProgress: null,
      prompt: '',
      history: [],
      isRequesting: false
    }
    this.scrollViewRef = React.createRef();
  }

  preloading = async () => {
    try {
      // Use fonts
      await useFonts()
    } catch (e) {
      console.warn(e)
    } finally {
      this.setState({ appIsReady: 1 })
      SplashScreen.hideAsync()
    }
  }

  componentDidMount() {
    // Onload methods
    this.preloading()
  }

  // Обработчик изменения размеров содержимого ScrollView
  handleContentSizeChange = (contentWidth, contentHeight) => {
    const scrollViewHeight = this.scrollViewRef.current?.getHeight?.() || 0;
    const contentBottomY = contentHeight - scrollViewHeight;
    this.scrollViewRef.current?.scrollTo?.({ y: contentBottomY, animated: true });
  };

  promptObjectFunc = () => {
    let promptObject = [...this.state.history, { "role": "user", "content": this.state.prompt }];
    return promptObject;
  }

  throttledOnDownloadProgress = throttle((data) => {
    if (data.event.currentTarget) {
      let response = data.event.currentTarget.response;
      let parts =  this.settupLines(response);
      this.setState({ downloadProgress: parts })
    }
  }, 30);

  settupLines = (response) => {
    let lines = response.split('data: ')
    let parts = '';
    lines.forEach(json => {
      try {
        let parse = JSON.parse(json);
        if (parse) {
          let part = parse.choices[0].delta.content;
          parts = parts + part.replace(/^\n{2}/, '');
        }
      } catch (error) { }
    });
    
    return parts;
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();
    if (this.state.isRequesting) {
      return
    }
    this.setState({ isRequesting: true })
    let promptObject = this.promptObjectFunc();
    this.setState({ history: [...this.state.history, { "role": "user", "content": this.state.prompt }] })
    try {
      const data = {
        model: 'gpt-3.5-turbo', // 'text-davinci-003'
        messages: promptObject,
        stream: true,
      };
      const response = await axios({
          method: 'post',
          url: 'https://api.openai.com/v1/chat/completions',
          data: data,
          transformResponse: this.settupLines,
          headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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' },
          responseType: 'json',
          onDownloadProgress: this.throttledOnDownloadProgress,
          signal
        })

        this.setState({ 
          history: [...this.state.history, { "role": "system", "content": response.data }],
          downloadProgress: '',
          prompt: '',
          isRequesting: false
        })

        console.log(response.data)
        
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isRequesting && this.state.downloadProgress) {
      
    }
  }

  render() {
    return (
      <SafeAreaView className="bg-slate-800 flex-1 w-full">
        <StatusBar />
        <ScrollView
          ref={this.scrollViewRef}
          onContentSizeChange={this.handleContentSizeChange}
        >
          <View className="bg-slate-800 pt-[85px] pb-[70px] px-5">
            {this.state.history.map((item, index) => (
              item.content.length > 1 &&
              <View key={index} className={"flex flex-row " + (item.role === 'system' ? 'justify-start' : 'justify-end')}>
                <Text selectable={true}
                  className={'my-2 rounded-t-3xl px-4 py-3 text-white ' + (item.role === 'system' ? 'rounded-br-3xl bg-white/10' : 'rounded-bl-3xl bg-teal-500/70')}
                >
                  {item.content}
                </Text>
              </View>
            ))}
            {this.state.downloadProgress &&
              <View className="flex flex-row justify-start">
                <Text selectable={true}
                  className={'my-2 rounded-t-3xl px-4 py-3 text-white rounded-br-3xl bg-white/10'}
                >
                  {this.state.downloadProgress}
                </Text>
              </View>
            }
            {!this.state.history.length > 0 &&
              <Text className="py-3 text-slate-500">
                Send message to start conversation ...
              </Text>
            }
          </View>
        </ScrollView>
        <View className="absolute top-0 h-[70px] w-full bg-slate-900 px-3 py-2">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-5">
              <Image
                className="w-[35px] h-[35px] rounded-full"
                source={require('./assets/icon.png')}
              />
              <View className="flex flex-column">
                <Text className="text-xl text-white">
                  AI Interface
                </Text>
                <Text className="text-slate-500">
                  for GPT-3.5
                </Text>
              </View>
            </View>
            <Pressable onPress={() => this.setState({ history: [] })} className="ml-2 flex justify-center items-center rounded-full w-[20px] h-[20px]">
              <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </Pressable>
          </View>
        </View>
        {!this.state.isRequesting ?
          <View className="flex flex-row justify-between items-center px-3 py-2 absolute bottom-0 h-[70px] w-full">
            <TextInput
              className="bg-slate-900 rounded-3xl text-md text-white px-3 py-3 w-full"
              onChangeText={text => this.setState({ prompt: text })}
              value={this.state.prompt}
              placeholder="Write a message ..."
              placeholderTextColor="rgb(107 114 128)"
              multiline={false}
            />
            <Pressable
              className="absolute right-5 flex justify-center items-center rounded-full bg-teal-500 active:opacity-50 pl-1 h-[38px] w-[38px]"
              onPress={this.handleFormSubmit}>
              <Ionicons name="ios-send" size={22} color="white" />
            </Pressable>
          </View> :
          <Text onPress={() => { abortController.abort() }} className="bg-slate-800 rounded-3xl text-md text-gray-500 px-3 py-2 w-full">
            Loading ...
          </Text>
        }
      </SafeAreaView>
    )
  }
}

export default App;