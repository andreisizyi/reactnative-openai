import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
// Components

class ChatBody extends Component {
    constructor(props) {
        super(props)

        this.scrollOffset = 0,
        this.userScrollUp = false

        this.handleScroll = this.handleScroll.bind(this)
        this.scrollViewRef = React.createRef()
    }

    // Handler for change content size ScrollView
    handleContentSizeChange = (contentWidth, contentHeight) => {
        if (this.userScrollUp) return
        const scrollViewHeight = this.scrollViewRef.current?.getHeight?.() || 0;
        const contentBottomY = contentHeight - scrollViewHeight;
        this.scrollViewRef.current?.scrollTo?.({ y: contentBottomY, animated: true });
    };

    handleScroll(event) {
        const currentOffset = event.nativeEvent.contentOffset.y;

        if (currentOffset < this.scrollOffset) {
            this.userScrollUp = true
        }
        
        this.scrollOffset = currentOffset
    }

    componentDidUpdate(prevProps, prevState) {
        // TODO if user scroll to full bottom set this.userScrollUp = false
        if (this.props.history !== prevProps.history) {
            this.userScrollUp = false
        }
    }

    render() {
        return (

            <ScrollView // TODO replace by Flat List
                ref={this.scrollViewRef}
                onContentSizeChange={this.handleContentSizeChange}
                onScroll={this.handleScroll}
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

export default React.memo(ChatBody);