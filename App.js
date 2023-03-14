import React, { Component } from 'react';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

// Screens
import ChatScreen from './screens/Chat'

// SplashScreen
SplashScreen.preventAutoHideAsync()

class App extends Component {

  constructor(props) {
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
      <ChatScreen/>
    )
  }
}

export default App;