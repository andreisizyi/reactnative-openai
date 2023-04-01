import React, { Component } from 'react';
import { Image, Text, View, Pressable } from 'react-native';

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons';

// Components
import Menu from './ChatHeaderParts/Menu';

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
    return title ? title + '...' : 'New conversation';
  };

  // Update all sended states from lower components
  // setUpper = (newState: State) => {
  //   this.setState(newState);
  // };

  // toggleMenu = () => {
  //   this.setState({ menuOpen: !this.state.menuOpen });
  // };

  render() {
    const title = this.title();
    return [
      <View key="header-bar" className="h-14 w-full py-2 top-0 flex flex-row items-center justify-between bg-slate-900 ">
        <View className="flex flex-row gap-4 items-center">
          <Pressable 
            onPress={() => this.props.navigation.navigate('List')}
            className="w-12 h-12 flex justify-center items-center rounded-full active:opacity-50">
            <Ionicons name="ios-chevron-back" size={22} color="white" />
          </Pressable>
            {/* <Image
                className="w-8 h-8 rounded-full"
                source={require('../assets/icon.png')}
            /> */}
          <View className="flex flex-column">
            <Text className="text-base text-white">{title} {global.currentChat}</Text>
          </View>
        </View>
        {/* <Pressable
          onPress={this.toggleMenu}
          className="w-12 h-12 flex justify-center items-center rounded-full active:opacity-50"
        >
          <Ionicons name="ellipsis-vertical" size={22} color="white" />
        </Pressable> */}
      </View>,
      // <Menu key="header-menu" menuOpen={this.state.menuOpen} setUpper={this.setUpper} />,
    ];
  }
}

export default React.memo(HeaderChat);