import React, { Component } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

// Screens
import Chat from './screens/Chat'
import List from './screens/List'

// SplashScreen
SplashScreen.preventAutoHideAsync()

interface AppState {
  appIsReady: number
}

type RootStackParamList = {
  List: undefined;
  Chat: undefined;
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(15 23 42)',
  },
};

const Stack = createStackNavigator<RootStackParamList>();

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
      <NavigationContainer
        theme={navTheme}
        >
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="List" component={List} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>

    )
  }
}

export default App;