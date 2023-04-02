import React, { Component } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import axios, { AxiosResponse } from 'axios'
import { NavigationProp } from '@react-navigation/native';

// Components
import Header from '../components/ChatHeader'
import Body from '../components/ChatBody'
import Prompt from '../components/ChatPrompt'

// Helpers
import RateLimeter from '../utils/helpers/RateLimiter'
import DB from '../utils/helpers/DB'

interface Props {}

interface State {
    downloadProgress: string[],
    history: Message[],
    isRequesting: boolean
}

interface Message {
    role: string,
    content: string
}

interface Props {
    navigation: NavigationProp<Record<string, object>>;
}

class ChatScreen extends Component<Props, State> {

    private db: DB
    private abortControl: AbortController
    private signal: AbortSignal
    private token: string

    constructor(props: Props) {
        super(props)
        this.state = {
            downloadProgress: [],
            history: [],
            isRequesting: false
        }
        this.abortControl = new AbortController()
        this.signal = this.abortControl.signal
    }

    async dataInit() {
        this.db = DB.getInstance()
        const messages = await this.db.getMessagesOfChat(global.currentChat)
        this.token = await this.db.getApiKey()
        console.log(this.token);
        console.log(messages);
        this.setState({
            history: messages
        })
    }
    
    componentDidMount() {
        this.dataInit()
    }

    componentWillUnmount() {
        this.stopResponse()
    }

    OnDownloadProgress = (data: any) => {
        if (data.event.currentTarget) {
            let response = data.event.currentTarget.response
            let parts = this.settupLines(response)
            this.setState({
                downloadProgress: parts
            })
        }
    }

    transformResponse = (response: string) => { 
        let array = this.settupLines(response)
        return array.join('')
    }

    stopResponse = () => {
        this.abortControl.abort()
        this.abortControl = new AbortController()
        this.signal = this.abortControl.signal
    }

    settupLines = (response: string) => {
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

    sendRequest = async (prompt: string) => {
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
        let chatId = await this.db.newChat(prompt.slice(0, 100))
        this.db.newMessage(prompt, "user", chatId)
       
        // Set to state
        this.setState({ history: history })
        // Request data
        const data = {
            model: 'gpt-3.5-turbo', // 'text-davinci-003'
            messages: history.slice(-7), // History only 7 last messages
            stream: true
        };
        // New rate limiter
        const rate = new RateLimeter(30)
        // Axios request try catch
        let message : string;
        try {
            // Axios request
            const response: AxiosResponse<string> = await axios({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                data: data,
                responseType: 'text',
                onDownloadProgress: rate.limit(this.OnDownloadProgress),
                transformResponse: this.transformResponse,
                signal: this.signal
            })
            message = response.data
        } catch (error) {
            // On error setup exising download progress
            if (this.state.downloadProgress.length > 0) {
                message = this.state.downloadProgress.join('')
            }
        }

        // Set content
        this.setState({
            history: [...this.state.history, {
                "role": "system",
                "content": message
            }],
        })
        // Add to DB
        this.db.newMessage(message, "system", chatId)

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

                <Header
                    navigation={this.props.navigation}
                    history={this.state.history}
                />

                <Body
                    history={this.state.history}
                    downloadProgress={this.state.downloadProgress}
                    isRequesting={this.state.isRequesting}
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