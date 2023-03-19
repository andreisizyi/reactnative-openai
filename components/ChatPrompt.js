import React, { Component } from 'react'
import { Text, View, TextInput, Pressable } from 'react-native'

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons'

class ChatRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prompt: null
        }
    }

    submit = () => {
        this.props.sendRequest(this.state.prompt)
        this.state.prompt = null
    }
    
    render() {
        return (
            <View className="absolute bottom-0 h-[70px] px-3 py-2 w-full flex flex-row justify-between items-center">
                {!this.props.isRequesting ?
                    <TextInput
                        className="w-full px-3 py-3 pr-14 bg-slate-900 rounded-3xl text-md text-white"
                        onChangeText={text => this.setState({ prompt: text })}
                        value={this.state.prompt}
                        placeholder="Write a message ..."
                        placeholderTextColor="rgb(107 114 128)"
                        multiline={false}
                    /> :
                    <Pressable onPress={this.props.stopResponse}
                        className="m-auto flex justify-center bg-red-500 active:opacity-50 rounded-3xl px-3 py-3">
                        <Text className="text-md text-white">
                            Stop responding
                        </Text>
                    </Pressable>
                }
                {!this.state.isRequesting && this.state.prompt &&
                    <Pressable
                        className="absolute h-[38px] w-[38px] right-5 pl-1 flex justify-center items-center rounded-full bg-teal-500 active:opacity-50"
                        onPress={this.submit}>
                        <Ionicons name="ios-send" size={22} color="white" />
                    </Pressable>
                }
            </View>
        )
    }
}

export default React.memo(ChatRequest);
