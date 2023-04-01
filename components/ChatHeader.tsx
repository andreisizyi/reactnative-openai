import React, { Component } from 'react';
import { Text, View, Pressable } from 'react-native';

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  history: { content: string }[],
  navigation: any;
};

type State = {
  menuOpen: boolean;
};

class HeaderChat extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      menuOpen: false,
    };
  }

  title = (): string => {
    const title = this.props?.history[0]?.content?.slice(0, 25);
    return title ? title : 'New conversation';
  };

  render() {
    const title = this.title();
    return (
      <View key="header-bar" className="h-14 w-full py-2 top-0 flex flex-row items-center justify-between bg-slate-900 ">
        <View className="flex flex-row gap-4 items-center">
          <Pressable 
            onPress={() => this.props.navigation.navigate('List')}
            className="w-12 h-12 flex justify-center items-center rounded-full active:opacity-50">
            <Ionicons name="ios-chevron-back" size={22} color="white" />
          </Pressable>
          <View className="flex flex-column">
            <Text className="text-base text-white">{title}</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default React.memo(HeaderChat);