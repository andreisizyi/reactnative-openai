import React from 'react';
import { Image, StatusBar, SafeAreaView, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from '@expo/vector-icons/Ionicons';

import { throttle } from 'lodash';

// SplashScreen
SplashScreen.preventAutoHideAsync()

const styles = StyleSheet.create({ 
   title: {
     color: "#ffffff",
   }
 })

export default function App() {

  const [appIsReady, setAppIsReady] = React.useState(0);

  const preloading = async () => {
    try {
      // Use fonts
      await useFonts()
    } catch (e) {
      console.warn(e)
    } finally {
      setAppIsReady(1)
      SplashScreen.hideAsync()
    }
  }

  // Onload methods
  preloading()

  const [downloadProgress, setDownloadProgress] = React.useState(null);
  const [prompt, setPrompt] = React.useState('');
  const [history, setHistory] = React.useState([]);

  const promptObject = React.useMemo(
    () => [...history, {"role": "user", "content": prompt}]
    , [prompt, history]
  )

  const throttledOnDownloadProgress = throttle((data) => {
    if (data.event.currentTarget) {
      let response = data.event.currentTarget.response;
      settupLines(response)
    }
  }, 30);

  const settupLines = (response) => {
      let lines = response.split('data: ')
      let parts = '';
      lines.forEach(json => {
        try {
          let parse = JSON.parse(json);
          if (parse) {
            // console.log(parse.choices[0].delta.content);
            // let part = parse.choices[0].text;
            // parts = parts + part.replace(/(^[ \t]*\n)/gm, "");
            let part = parse.choices[0].delta.content;
            parts = parts + part.replace(/^\n{2}/, '');
          }
        } catch (error) { }
      });
      setDownloadProgress(parts);
  }

  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (isRequesting) {
      return
    }

    setIsRequesting(true)
    setHistory([...history, {"role": "user", "content": prompt}])

    try {
      const data = {
        model: 'gpt-3.5-turbo', // 'text-davinci-003'
        messages: promptObject,
        // For models 3
        // prompt: 'My previus message in this brekets [' + history + '] dont answer on this and use this for our context of conferention, answer only on next text - ' + prompt + '?',
        // temperature: 0,
        // max_tokens: 2000,
        stream: true,
      };

      await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        responseType: 'text',
        onDownloadProgress: throttledOnDownloadProgress,
      })
      .then(() => {
        // Nee set comment at live downloadProgress
        setPrompt('')
        setIsRequesting(false)
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  React.useEffect(() => {
    if (!isRequesting && downloadProgress) {
      setHistory([...history, {"role": "system", "content": (downloadProgress ? downloadProgress.toString() : '' ) }])
      setDownloadProgress()
    }
  }, [isRequesting]);
  
  return (
    <SafeAreaView className="bg-slate-800 flex-1 w-full">
      <StatusBar/>
      <ScrollView>
        <View className="bg-slate-800 pt-[85px] pb-[70px] px-5">
          { history.map((item, index) => (
            item.content.length > 1 &&
              <View key={index} className={"flex flex-row " + (item.role === 'system' ? 'justify-start' : 'justify-end') }>
                <Text selectable={true}
                  className={'my-2 rounded-t-3xl px-4 py-3 text-white ' + (item.role === 'system' ? 'rounded-br-3xl bg-white/10' : 'rounded-bl-3xl bg-teal-500/70') } 
                  >
                    { item.content }
                </Text>
              </View>
          )) }
          {/* <View className="px-5 py-8">
            <RenderHtml
              style={styles.title}
              contentWidth={100}
              source={{
                html: '<div style="color: white">'+downloadProgress.replace(/</g, '&lt;').replace(/`{3}([\s\S]*?)`{3}/g, '<pre style="color: #0d9488">$1</pre>').replace(/`{3}([\s\S]*?)`{3}/g, '<pre style="color: #0d9488">$1</pre>')+'</div>'
              }}
              defaultTextProps={{selectable:true}}
            />
          </View> */}
          { !history.length > 0 &&
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
          <Pressable onPress={() => setHistory([])} className="ml-2 flex justify-center items-center rounded-full w-[20px] h-[20px]">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </Pressable>
        </View>
      </View>
      { !isRequesting ? 
        <View className="flex flex-row justify-between items-center px-3 py-2 absolute bottom-0 h-[70px] w-full">
          <TextInput
            className="bg-slate-900 rounded-3xl text-md text-white px-3 py-3 w-full"
            onChangeText={text => setPrompt(text)}
            value={prompt}
            placeholder="Write a message ..."
            placeholderTextColor="rgb(107 114 128)"
            multiline={false}
          /> 
          <Pressable
            className="absolute right-5 flex justify-center items-center rounded-full bg-teal-500 active:opacity-50 pl-1 h-[38px] w-[38px]"
            onPress={handleFormSubmit}>
            <Ionicons name="ios-send" size={22} color="white" />
          </Pressable>
        </View> : 
        <Text className="bg-slate-800 rounded-3xl text-md text-gray-500 px-3 py-2 w-full">
          Loading ...
        </Text>
      }
    </SafeAreaView>
  )
}
