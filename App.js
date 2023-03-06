import React from 'react';
import { Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import axios from 'axios';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

import { throttle } from 'lodash';

// SplashScreen
SplashScreen.preventAutoHideAsync()

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

      axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        responseType: 'text',
        onDownloadProgress: throttledOnDownloadProgress,
      })
      .then(() => {
        setHistory([...history, {"role": "user", "content": prompt}])
        setIsRequesting(false)
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="bg-gray-800 min-h-[100vh] w-full">
        
        <View className="px-5 py-8 bg-white">
          <View className="text-xl pt-[50px] pb-[10px]">
            <View className="w-full border-slate-300 rounded-sm border-b-[1px]">
              <TextInput
                className="w-full py-[20px] px-[0] text-slate-800 text-xl"
                onChangeText={text => setPrompt(text)}
                value={prompt}
                placeholder="Your request"
                multiline={true}
              />
            </View>
          </View>

          <Pressable
              className="active:opacity-50 mt-7 px-5 py-3 bg-teal-600 border-blue-600 rounded-lg w-full"
              onPress={handleFormSubmit}>
              <Text
                  className="text-center text-white text-xl font-medium">
                    Send
              </Text>
          </Pressable>
        </View>

        
        <View className="text-md pt-[20px] pb-[10px]">
            <View className="flex flex-row flex-wrap px-5">
              <Text className="text-teal-500 pr-2">
                History:
              </Text>
              {history.map((item, index) => (
                <Text className="w-auto text-teal-300 opacity-30 pr-2" key={index}>
                  [ {item.content} ],
                </Text>
              ))}
            </View>
            <Text
              onPress={() => setHistory([])}
              className="px-5 pt-5 pb-5 text-teal-500 font-medium border-teal-500 border-b-[1px]">
                Reset History [X]
            </Text>
            <Text className="text-white px-5 py-8">
              {downloadProgress}
            </Text>
        </View>

      </View>
    </ScrollView>
  );
}
