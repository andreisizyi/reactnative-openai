import React, { useCallback, Component } from 'react'
import { DeviceEventEmitter, StatusBar, SafeAreaView, Text, View, TextInput, Pressable, ScrollView } from 'react-native'
import axios from 'axios'
import { throttle } from 'lodash'
import { LinearGradient } from 'expo-linear-gradient'

// Components
import HeaderChat from '../components/HeaderChat'

// Fonts
import Ionicons from '@expo/vector-icons/Ionicons'

var test = 0

const rateLimeterStart = 30
var rateLimeterState = false
var rateLimeterDynamical = rateLimeterStart
function rateLimeter(func) {
    // Iterational slowing function rate
    return function (...args) {
        if (rateLimeterState) return
        mutex = true

        const result = func(...args);

        if (rateLimeterDynamical < 500) rateLimeterDynamical *= 1.05
        setTimeout(() => {
            rateLimeterState = false
        }, rateLimeterDynamical)
        return result;
    }
}

const token = "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"

export default class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            downloadProgress: null,
            prompt: '',
            history: [],
            isRequesting: false,
            scrollOffset: 0,
            scrollDirection: '',
            userScrollUp: false,
            throttled: false
        }

        this.handleScroll = this.handleScroll.bind(this)
        this.abortControl = new AbortController()
        this.signal = this.abortControl.signal
        this.scrollViewRef = React.createRef()

        DeviceEventEmitter.addListener('chat', (newState) => {
            this.setState(newState)
        });
    }

    // Update all sended states from lower components
    setUpper = (newState) => {
        this.setState(newState)
    }

    // Handler for change content size ScrollView
    handleContentSizeChange = (contentWidth, contentHeight) => {
        if (this.state.userScrollUp) return
        const scrollViewHeight = this.scrollViewRef.current?.getHeight?.() || 0;
        const contentBottomY = contentHeight - scrollViewHeight;
        this.scrollViewRef.current?.scrollTo?.({ y: contentBottomY, animated: true });
    };

    handleScroll(event) {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > this.state.scrollOffset ? 'down' : 'up';

        if (currentOffset < this.state.scrollOffset) {
            this.setState({
                userScrollUp: true
            });
        }

        this.setState({
            scrollOffset: currentOffset,
            scrollDirection: direction
        });
    }

    promptObjectFunc = () => {
        let promptObject = [...this.state.history, { "role": "user", "content": this.state.prompt }];
        return promptObject;
    }

    // throttle(() => {}, rate)
    OnDownloadProgress = (data) => {
        console.log(++test, this.state.downloadProgress?.length, rateLimeterDynamical);

        if (data.event.currentTarget) {
            let response = data.event.currentTarget.response
            let parts = this.settupLines(response)
            this.setState({ downloadProgress: parts })
        }
    }

    shouldComponentUpdate(nextProps, nextState) { // TODO
        // Return true if component should update, false otherwise
        if (nextState.state !== this.state) {

            return true
        } else {
            return false
        }

    }

    settupLines = (response) => {

        const lines = response.split('data: ')
        if (!lines) return
        lines.pop()
        const parts = lines.map((json) => {
            try {
                const parse = JSON.parse(json);
                if (parse) {
                    const part = parse.choices[0].delta.content;
                    return part.replace(/^\n{2}/, '');
                }
            } catch (error) { }
            return null;
        }).filter((part) => part !== null)
        return parts;
    }

    transformResponse = (response) => {
        let array = this.settupLines(response)
        return array.join('')
    }

    stopResponse = () => {
        // Stop updating screen on this click
        this.abortControl.abort()
        this.abortControl = new AbortController()
        this.signal = this.abortControl.signal
    }

    handleFormSubmit = async (event) => {

        event.preventDefault();
        if (this.state.isRequesting) {
            return
        }
        this.setState({ isRequesting: true })
        let promptObject = this.promptObjectFunc();
        this.setState({ history: [...this.state.history, { "role": "user", "content": this.state.prompt }] })

        try {
            const data = {
                model: 'gpt-3.5-turbo', // 'text-davinci-003'
                messages: promptObject,
                stream: true,
            };
            const response = await axios({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                data: data,
                transformResponse: this.transformResponse,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'text',
                onDownloadProgress: rateLimeter(this.OnDownloadProgress),
                signal: this.signal,
                error: ''
            })

            this.setState({
                history: [...this.state.history, { "role": "system", "content": response.data }],
            })

        } catch (error) {

            //console.log(error);

            if (this.state.downloadProgress) {
                this.setState({
                    history: [...this.state.history, { "role": "system", "content": this.state.downloadProgress.join('') }]
                })
            }

        }
        //console.log(this.state.history);
        this.setState({
            downloadProgress: null,
            prompt: '',
            isRequesting: false,
            userScrollUp: false,
        })

        mutex = false
        rateLimeterDynamical = rateLimeterStart
    };

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        return (
            <SafeAreaView className="flex-1 bg-slate-800">
                <StatusBar />
                {/* <LinearGradient className="absolute h-full w-full" start={[-0.3, 0.2]} end={[0.5, 0.8]} colors={['rgba(15,23,42,0.1)', 'rgba(255,138,92,0.05)']} /> */}
                <ScrollView
                    ref={this.scrollViewRef}
                    onContentSizeChange={this.handleContentSizeChange}
                    onScroll={this.handleScroll}
                >
                    <View className="pt-16 pb-[80px] mt-2 px-5">
                        {this.state.history.map((item, index) => (
                            <View key={index}
                                className={`flex flex-row 
                            ${item.role === 'system' ? 'justify-start' : 'justify-end'}`}>
                                <Text selectable={true}
                                    className={`mt-2 mb-5 rounded-t-3xl px-4 py-3 text-white 
                              ${item.role === 'system' ? 'rounded-br-3xl bg-white/10' : 'rounded-bl-3xl bg-teal-500/70'}`}
                                >
                                    {item.content}
                                </Text>
                                <Text className={`absolute bottom-0 text-xs
                            ${item.role === 'system' ? 'text-slate-500 left-0' : 'text-teal-500 opacity-70 right-0'}`}>
                                    {item.role}
                                </Text>
                            </View>
                        ))}
                        {this.state.downloadProgress &&
                            <View className="flex flex-row justify-start">
                                <Text selectable={false}
                                    className={'my-2 rounded-t-3xl px-4 py-3 text-white rounded-br-3xl bg-white/10'}
                                >
                                    {this.state.downloadProgress.map((item, index) => (
                                        <Text key={index + item}>
                                            {item}
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        }
                        {!this.state.history.length > 0 &&
                            <Text className="self-center my-2 px-4 py-3 text-white rounded-3xl bg-white/10">
                                Send message to start conversation
                            </Text>
                        }
                    </View>
                </ScrollView>

                <HeaderChat
                    history={this.state.history}
                    setUpper={this.setUpper}
                />

                <View className="absolute bottom-0 h-[70px] px-3 py-2 w-full flex flex-row justify-between items-center">
                    {!this.state.isRequesting ?
                        <TextInput
                            className="w-full px-3 py-3 pr-14 bg-slate-900 rounded-3xl text-md text-white"
                            onChangeText={text => this.setState({ prompt: text })}
                            value={this.state.prompt}
                            placeholder="Write a message ..."
                            placeholderTextColor="rgb(107 114 128)"
                            multiline={false}
                        /> :
                        <Pressable onPress={this.stopResponse}
                            className="m-auto flex justify-center bg-red-500 active:opacity-50 rounded-3xl px-3 py-3">
                            <Text className="text-md text-white">
                                Stop responding
                            </Text>
                        </Pressable>
                    }
                    {!this.state.isRequesting && this.state.prompt &&
                        <Pressable
                            className="absolute h-[38px] w-[38px] right-5 pl-1 flex justify-center items-center rounded-full bg-teal-500 active:opacity-50"
                            onPress={this.handleFormSubmit}>
                            <Ionicons name="ios-send" size={22} color="white" />
                        </Pressable>
                    }
                </View>


            </SafeAreaView>
        )
    }
}