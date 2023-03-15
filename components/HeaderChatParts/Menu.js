
import React, { Component } from 'react'
import { DeviceEventEmitter, Text, View, Pressable } from 'react-native'

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons'

export default class ChatScreen extends Component {
    constructor(props) {
        super(props)
    }

    clearHistory = () => {
        DeviceEventEmitter.emit('chat', { history: [] })
        this.props.setUpper({ menuOpen: false })
    }

    closeMenu = () => {
        this.props.setUpper({ menuOpen: false })
    }

    top = { zIndex: 2 }

    render() {
        return (
            this.props.menuOpen &&
            <View style={this.top}
                className="absolute h-full w-full">
                <View
                    onTouchStart={this.closeMenu}
                    className="h-full w-full">
                </View>
                <View className="absolute right-0 top-[55px] rounded-l-xl bg-white">
                    <View rclassName="flex flex-column space-y-3 items-center justify-between">
                        <Pressable 
                            onPress={this.clearHistory}
                            className="flex flex-row items-center px-5 py-3">
                            <Text className="mr-1 text-base text-red-500">Clear history</Text>
                            <Ionicons name="ios-alert-circle-outline" size={18} color="red" />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }
}