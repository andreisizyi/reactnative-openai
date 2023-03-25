// import React from 'react';
// import { View, Button } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

// function HomeScreen({ navigation }) {
//   return (
//     <View>
//       <Button
//         title="Go to Chat"
//         onPress={() => navigation.navigate('Chat')}
//       />
//     </View>
//   );
// }

// function ChatScreen({ navigation }) {
//   return (
//     <View>
//       <Button
//         title="Go back"
//         onPress={() => navigation.goBack()}
//       />
//     </View>
//   );
// }

// class App extends React.Component {
//   render() {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Chat" component={ChatScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

// Screens
import ChatScreen from './screens/Chat'
import ListScreen from './screens/List'

// SplashScreen
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(15 23 42)',
  },
};

interface AppState {
  appIsReady: number
}

class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      appIsReady: 0
    }
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

  render() {
    return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="List" component={ ListScreen } />
          <Stack.Screen name="Chat" component={ ChatScreen } />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;