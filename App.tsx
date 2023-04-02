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
import SettingsScreen from './screens/Settings'

// Helpers
import DB from './utils/helpers/DB'

// SplashScreen
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator();

interface AppState {
  appIsReady: number,
  initialRouteName: string
}

global.currentChat = 0;

class App extends Component<{}, AppState> {

  private db: DB

  constructor(props: {}) {
    super(props);
    this.state = {
      appIsReady: 0,
      initialRouteName: 'Settings'
    }
    this.db = DB.getInstance();
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
    let apikey = await this.db.getApiKey()
    if (apikey) {
      this.setState({
        initialRouteName : "List"
      })
    }
    // Onload methods
    this.preloading()
  }

  render() {
    if (this.state.appIsReady === 0) {
      return null;
    }
    return (
      <View className="flex-1 bg-teal-700">
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'flip'
            }}
            initialRouteName={this.state.initialRouteName}
          >
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  }
}

export default App;