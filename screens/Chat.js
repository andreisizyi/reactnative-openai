import React, { Component } from 'react'
import { DeviceEventEmitter, StatusBar, SafeAreaView, Text, View, TextInput, Pressable, ScrollView } from 'react-native'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'

// Components
import Header from '../components/ChatHeader'
import Body from '../components/ChatBody'
import Prompt from '../components/ChatPrompt'

var test = 0

// Helpers
import RateLimeter from '../utils/helpers/RateLimiter'

const token = "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"

class ChatScreen extends Component {

    constructor(props) {
		super(props)
		this.state = {
			downloadProgress: [],
			history: [],
			isRequesting: false
		}
		this.abortControl = new AbortController()
		this.signal = this.abortControl.signal
		DeviceEventEmitter.addListener('chat', (newState) => {
			this.setState(newState)
		});
	}

    OnDownloadProgress = (data) => {
		//console.log(++test, this.state.downloadProgress?.length);
		if (data.event.currentTarget) {
			let response = data.event.currentTarget.response
			let parts = this.settupLines(response)
			this.setState({
				downloadProgress: parts
			})
		}
	}

	transformResponse = (response) => { 
		let array = this.settupLines(response)
		return array.join('')
	}

	stopResponse = () => {
		this.abortControl.abort()
		this.abortControl = new AbortController()
		this.signal = this.abortControl.signal
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
			} catch (error) {}
			return null;
		}).filter((part) => part !== null)
		return parts;
	}

	sendRequest = async (prompt) => {
		// Requesting
		if (this.state.isRequesting) return
		this.setState({
			isRequesting: true
		})
        // Prompt with history
        const history = [
            ...this.state.history, {
                "role": "user",
                "content": prompt
            }
        ]
        // Set to state
        this.setState({ history: history })
        // Request data
        const data = {
            model: 'gpt-3.5-turbo', // 'text-davinci-003'
            messages: history,
            stream: true
        };
        // New rate limiter
        const rate = new RateLimeter(30)
        // Axios request try catch
		try {
            // Axios request
			const response = await axios({
				method: 'post',
				url: 'https://api.openai.com/v1/chat/completions',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
                data: data,
				responseType: 'text',
				onDownloadProgress: rate.limit(this.OnDownloadProgress),
                transformResponse: this.transformResponse,
				signal: this.signal
			})
            // Set full response content
			this.setState({
				history: [...this.state.history, {
					"role": "system",
					"content": response.data
				}],
			})
		} catch (error) {
            // On error setup exising download progress
			if (this.state.downloadProgress.length > 0) {
				this.setState({
					history: [...this.state.history, {
						"role": "system",
						"content": this.state.downloadProgress.join('')
					}]
				})
			}
		}
        // After each request set default values
		this.setState({
			downloadProgress: [],
			isRequesting: false
		})
	};

    render() {
        return (
            <SafeAreaView className="flex-1 bg-slate-800">
                <StatusBar />
                {/* <LinearGradient className="absolute h-full w-full" start={[-0.3, 0.2]} end={[0.5, 0.8]} colors={['rgba(15,23,42,0.1)', 'rgba(255,138,92,0.05)']} /> */}

                <Header
                    history={this.state.history}
                    setUpper={this.setUpper}
                />

                <Body
                    history={this.state.history}
                    downloadProgress={this.state.downloadProgress}
                />

                <Prompt
                    isRequesting={this.state.isRequesting}
                    stopResponse={this.stopResponse}
                    sendRequest={this.sendRequest}
                />

            </SafeAreaView>
        )
    }
}

export default ChatScreen;