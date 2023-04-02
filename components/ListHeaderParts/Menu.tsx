import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View, Pressable } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  menuOpen: boolean;
  setUpper: ({ menuOpen }: { menuOpen: boolean }) => void;
  navigation: NavigationProp<Record<string, object>>;
}

class Menu extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  clearHistory = () => {
    DeviceEventEmitter.emit('deleteAll');
    this.props.setUpper({ menuOpen: false });
  };

  closeMenu = () => {
    this.props.setUpper({ menuOpen: false });
  };

  top = { zIndex: 2 };

  render() {
    return (
      this.props.menuOpen && (
        <View style={this.top} className="absolute h-full w-full">
          <View onTouchStart={this.closeMenu} className="h-full w-full"></View>
          <View className="absolute right-0 top-[55px] rounded-l-xl bg-white">
            <View className="flex flex-column py-3 space-y-3 justify-between">
              <Pressable onPress={() => {
                this.props.navigation.navigate('Settings')
                this.closeMenu()
              }} className="flex flex-row items-center px-5">
                <Text className="mr-1 text-base">Settings</Text>
              </Pressable>
              <Pressable onPress={this.clearHistory} className="flex flex-row items-center px-5">
                <Text className="mr-1 text-base text-red-500">Clear history</Text>
              </Pressable> 
            </View>
          </View>
        </View>
      )
    );
  }
}

export default Menu;