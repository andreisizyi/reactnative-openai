import React, { Component } from 'react'
import { StatusBar, SafeAreaView, Text, View, Pressable, FlatList } from 'react-native'


var test = 0

// Helpers
import RateLimeter from '../utils/helpers/RateLimiter'

const token: string = "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"


import { NavigationScreenProp } from 'react-navigation';

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface ListItem {
    id: string;
    title: string;
}

interface State {
    data: ListItem[];
}

class ChatScreen extends Component<Props, State> {

    private abortControl: AbortController;
    private signal: AbortSignal;

    constructor(props: Props) {
        super(props)
        this.state = {
            data: [
                { id: '1', title: 'React Native, a framework for building apps using React' },
                { id: '2', title: 'JavaScript' },
                { id: '3', title: 'TypeScript, a superset of JavaScript that adds optional static typing' },
                { id: '4', title: 'Firebase, a mobile and web application development platform' },
                { id: '5', title: 'React Navigation, a routing and navigation library for React Native' },
                { id: '6', title: 'Redux' },
                { id: '7', title: 'GraphQL, a query language for APIs' },
                { id: '8', title: 'Node.js, an open-source, cross-platform JavaScript runtime environment' },
                { id: '9', title: 'MongoDB, a cross-platform document-oriented database program' },
                { id: '10', title: 'Expo, a free and open-source platform for building native apps' },
                { id: '11', title: 'REST API, a standard for building web services using HTTP requests' },
            ],
        }
    }

    renderItem = ({ item }: { item: ListItem }) => (
        // <Pressable onPress={() => console.log(`Pressed ${item.title}`)}>
        //     <Text>{item.title}</Text>
        // </Pressable>
        <View className="flex flex-row justify-start px-5 py-1">
            <Pressable
                onPress={() => this.props.navigation.navigate('Chat')}
            >
                <Text className="leading-5 my-2 px-4 py-3 text-white rounded-3xl bg-white/10">{item.title}</Text>
            </Pressable>
        </View>
    );
    render() {
        return (
            <SafeAreaView className="flex-1 bg-slate-800">
                <StatusBar />
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        )
    }
}

export default ChatScreen;