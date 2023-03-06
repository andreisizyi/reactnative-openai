import React from 'react';
import { Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import axios from 'axios';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

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
  const [history, setHistory] = React.useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        model: 'text-davinci-003',
        prompt: 'My previus message in this brekets [' + history + '] dont answer on this and use this for our context of conferention, answer only on next text - ' + prompt + '?',
        temperature: 0,
        max_tokens: 200,
        stream: true,
      };

      axios.post('https://api.openai.com/v1/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        responseType: 'text',
        onDownloadProgress: function (data) {
          const response = data.event.currentTarget.response;
          
          let lines = response.split('data: ')
          
          let parts = '';
          lines.forEach(json => {
            try {
              let parse = JSON.parse(json);
              if (parse) {
                let part = parse.choices[0].text;
                parts = parts + part.replace(/(^[ \t]*\n)/gm, "");
                setDownloadProgress(parts);
              }
            } catch (error) { }
          });
          console.clear()
          console.log(parts); // обрабатываем ответ
        }
      }).then(function (response) {
        setHistory(history + prompt + ', ' )
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
            <Text className="text-teal-500 px-5 pb-5 border-teal-500 rounded-sm border-b-[1px]">
              History: { history }
            </Text>
            <Text className="text-white px-5 py-8">
              {downloadProgress}
            </Text>
        </View>

      </View>
    </ScrollView>
  );
}
