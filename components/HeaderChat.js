import React, { Component } from 'react';
import { Text, View, Pressable } from 'react-native';

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons';

export default class HeaderChat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false
        }
    }

    render() {
        return ([
            <View key="header-bar" className="absolute h-14 w-full py-2 top-0 flex flex-row items-center justify-between bg-slate-900 ">
                <View className="flex flex-row gap-4 items-center">
                    {/* <Image
                    className="w-8 h-8 rounded-full"
                    source={require('./assets/icon.png')}
                  /> */}
                    <Pressable
                        className="w-12 h-12 flex justify-center items-center rounded-full active:opacity-50"
                    >
                        <Ionicons name="ios-chevron-back" size={22} color="white" />
                    </Pressable>
                    <View className="flex flex-column">
                        <Text className="text-base text-white">
                            {this.props.history[0]?.content?.slice(0, 25) ?? 'New conversation'}...
                        </Text>
                    </View>
                </View>
                <Pressable onPress={() => this.setState({ menuOpen: !this.props.menuOpen })}
                    className="w-12 h-12 flex justify-center items-center rounded-full active:opacity-50">
                    <Ionicons name="ellipsis-vertical" size={22} color="white" />
                </Pressable>
            </View>,

            this.state.menuOpen &&
            <View key="header-menu"
                style={{ zIndex: 2 }}
                className="absolute h-full w-full">
                <View
                    onTouchStart={() => { this.setState({ menuOpen: false }) }}
                    className="h-full w-full">
                </View>
                <View className="absolute right-0 top-[55px] rounded-l-xl bg-white">
                    <View rclassName="flex flex-column space-y-3 items-center justify-between">
                        <Pressable onPress={() => {
                            this.props.setUpper({ history: [] })
                            this.setState({ menuOpen: false })
                        }}>
                            <Text className="px-5 py-3 text-base text-black">
                                Clear history
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        ])
    }
}