import React, { Component } from 'react'
import { Text, View, ScrollView, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native'

interface IChatHistory {
    role: string;
    content: string;
}

interface IChatBodyProps {
    history: IChatHistory[];
    downloadProgress: string[];
    isRequesting: boolean;
}

interface IChatBodyState {
    scrollOffset: number;
    scrollViewHeight: number;
    userScrollUp: boolean;
}

class ChatBody extends Component<IChatBodyProps, IChatBodyState> {
    scrollViewRef = React.createRef<ScrollView>();

    constructor(props: IChatBodyProps) {
        super(props);

        this.state = {
            scrollOffset: 0,
            scrollViewHeight: 0,
            userScrollUp: false,
        };

        this.handleScroll = this.handleScroll.bind(this);
        this.handleContentSizeChange = this.handleContentSizeChange.bind(this);
    }

    handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ scrollViewHeight: height });
    }

    // Handler for change content size ScrollView
    handleContentSizeChange(contentWidth: number, contentHeight: number): void {
        if (this.state.userScrollUp) return;
        const scrollViewHeight = this.state.scrollViewHeight;
        const contentBottomY = contentHeight - scrollViewHeight;
        this.scrollViewRef.current?.scrollTo?.({ y: contentBottomY, animated: true });
    };

    handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

        if (contentOffset.y < this.state.scrollOffset) {
            this.setState({ userScrollUp: true });
        } else if (contentOffset.y >= contentSize.height - layoutMeasurement.height) {
            // If user scrolled to bottom
            this.setState({ userScrollUp: false });
        }

        this.setState({ scrollOffset: contentOffset.y });
    }

    componentDidUpdate(prevProps: IChatBodyProps): void {
        // If new request set userScrollUp false
        if (this.props.history !== prevProps.history) {
            this.setState({ userScrollUp: false });
        }
    }

    render() {
        return (

            <ScrollView // TODO replace by Flat List
                ref={this.scrollViewRef}
                onContentSizeChange={this.handleContentSizeChange}
                onScroll={this.handleScroll}
                onLayout={this.handleLayout}
            >
                <View className="pb-[80px] mt-2 px-5">
                    {this.props.history.map((item, index) => (
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

                    {this.props.downloadProgress.length === 0 && this.props.isRequesting &&
                        <View className="flex flex-row justify-start">
                            <Text className="my-2 px-4 py-3 text-white rounded-3xl bg-white/10">
                                Typing...
                            </Text>
                        </View>
                    }
                    
                    {this.props.downloadProgress.length > 0 &&
                        <View className="flex flex-row justify-start">
                            <Text selectable={false}
                                className={'my-2 rounded-t-3xl px-4 py-3 text-white rounded-br-3xl bg-white/10'}
                            >
                                {this.props.downloadProgress.map((item, index) => (
                                    <Text key={index + item}>
                                        {item}
                                    </Text>
                                ))}
                            </Text>
                        </View>
                    }

                    {this.props.history.length === 0 &&
                        <Text className="self-center my-2 px-4 py-3 text-white rounded-3xl bg-white/10">
                            Send message to start conversation
                        </Text>
                    }

                </View>
            </ScrollView>

        )
    }
}

export default ChatBody;