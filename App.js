import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
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
    <View className="bg-gray-800 min-h-[100vh] w-full">
      <ScrollView className="flex-1">
        <View className="pb-3 w-full">
          {/* { history.length > 0 && */}
            <View className="text-md pt-[20px] pb-[10px] px-3">
                <View className="max-h-[100at ispx] px-5 pt-5 pb-5 flex flex-row flex-nowrap items-center border-teal-500 border-b-[1px]">
                  
                  <Pressable onPress={() => setHistory([])} className="pr-2">
                    <Text>Clean messaging history</Text>
                    <Ionicons name="close-sharp" size={24} color="#0d9488" />
                  </Pressable>

                </View>

                {history.map((item, index) => (
                  item.content.length > 1 &&
                    <Text className={'rounded mt-5 px-5 py-2 text-white ' + (item.role === 'system' ? 'ml-3 bg-white/10' : 'mr-3 bg-teal-500/70') } key={index}>
                        { item.content }
                    </Text>
                ))}

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
            </View>
          {/* } */}
          { !history.length > 0 &&
            <Text className="text-md py-12 px-5 text-white opacity-30 pr-2">
              Send message to start conversation
            </Text>
          }
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior="padding"
        className="flex flex-row w-full bottom-0 pl-5 bg-white">
        <View className="w-full border-slate-300 rounded-sm w-[85%]">
          { !isRequesting ?
          <TextInput
            className="w-full py-[15px] pl-[0] pr-10 text-slate-800 text-xl"
            onChangeText={text => setPrompt(text)}
            value={prompt}
            placeholder="Your request"
            multiline={false}
          />
          : 
            <Text className="w-full py-[15px] pl-[0] pr-10 text-slate-800 text-xl">
              Loading ...
            </Text>
          }
        </View>
        <Pressable
            className="flex justify-center items-center pl-1 bg-teal-500 active:opacity-50 w-[15%] h-100"
            onPress={handleFormSubmit}>
            <Ionicons name="md-send-sharp" size={25} color="white" />
        </Pressable>
      </KeyboardAvoidingView>
      
    </View>
    
  );
}
