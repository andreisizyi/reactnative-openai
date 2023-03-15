export default class BottomChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prompt: '',
            isRequesting: false,
            throttled: false,
            rate: rate
        }
    }

    promptObjectFunc = () => {
        let promptObject = [...this.state.history, { "role": "user", "content": this.state.prompt }];
        return promptObject;
    }

    // throttle(() => {}, rate)
    throttledOnDownloadProgress = (data) => {

        // Iterational slowing update rate
        if (this.state.throttled) return

        this.setState({ throttled: true })
        if (this.state.rate < 500) {
            this.setState({ rate: this.state.rate + this.state.rate*2 / this.state.rate })
        }

        setTimeout(() => {
            this.setState({ throttled: false })
        }, rate)

        if (data.event.currentTarget) {
            let response = data.event.currentTarget.response
            let parts = this.settupLines(response)
            this.setState({ downloadProgress: parts })
        }
    };

    settupLines = (response) => {
        let lines = response.split('data: ')
        let parts = [];
        lines.forEach(json => {
            try {
                let parse = JSON.parse(json);
                if (parse) {
                    let part = parse.choices[0].delta.content;
                    parts.push(part.replace(/^\n{2}/, ''));
                }
            } catch (error) { }
        });

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
                    'Authorization': 'Bearer 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'
                },
                responseType: 'json',
                onDownloadProgress: this.throttledOnDownloadProgress,
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
            rate: rate
        })
    };
    
    render() {
        return (
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
        )
    }
} F
