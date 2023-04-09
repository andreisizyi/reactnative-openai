import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'
import 'expo-dev-client'
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

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

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});
// Add event listeners for interstitial ad events
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  console.log('Interstitial ad loaded');
  interstitial.show();
});
interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  console.log('Interstitial ad closed');
});
interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
  console.warn('Interstitial ad error:', error);
});

// Load the interstitial ad
interstitial.load();

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
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    )
  }
}

export default App;