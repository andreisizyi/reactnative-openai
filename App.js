import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  const [downloadProgress, setDownloadProgress] = React.useState(null);
  const [prompt, setPrompt] = React.useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        model: 'text-davinci-003',
        prompt: prompt + '?',
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
                let part = JSON.parse(json).choices[0].text;
                parts = parts + part;
                setDownloadProgress(parts);
              }
            } catch (error) { }
          });
          console.clear()
          console.log(parts); // обрабатываем ответ
        }
      });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={text => setPrompt(text)}
        value={prompt}
        placeholder="Введите prompt"
      />
      <TouchableOpacity onPress={handleFormSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Отправить</Text>
      </TouchableOpacity>
      <Text style={styles.progressText}>{downloadProgress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '100%'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
