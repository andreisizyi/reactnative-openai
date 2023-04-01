import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'


// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

// Screens
import ChatScreen from './screens/Chat'
import ListScreen from './screens/List'

// Helpers
import DB from './utils/helpers/DB'

// SplashScreen
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator();

interface AppState {
  appIsReady: number
}

global.currentChat = 0;

class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      appIsReady: 0
    }
    const db = DB.getInstance();
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

  async componentDidMount() {
    // Onload methods
    this.preloading()
  }

  render() {
    return (
      <View className="flex-1 bg-teal-700">
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'flip'
            }}
            
          >
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  }
}

export default App;