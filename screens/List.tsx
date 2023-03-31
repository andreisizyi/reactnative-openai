import React, { Component } from 'react'
import { StatusBar, SafeAreaView, Text, View, Pressable, FlatList } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

// Helpers
import DB from '../utils/helpers/DB'

// Components
import Header from '../components/ListHeader'

const token: string = "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"

interface Props {
    navigation: any;
}

interface ListItem {
    id: string;
    name: string;
}

interface State {
    data: ListItem[];
}

class ListScreen extends Component<Props, State> {

    db: any
    data: ListItem[]

    constructor(props: Props) {
        super(props)
        this.dataInit();
        // this.state = {
        //     data: [
        //         { id: '1', name: 'React Native, a framework for building apps using React' },
        //         { id: '2', name: 'JavaScript' },
        //         { id: '3', name: 'TypeScript, a superset of JavaScript that adds optional static typing' },
        //         { id: '4', name: 'Firebase, a mobile and web application development platform' },
        //         { id: '5', name: 'React Navigation, a routing and navigation library for React Native' },
        //         { id: '6', name: 'Redux' },
        //         { id: '7', name: 'GraphQL, a query language for APIs' },
        //         { id: '8', name: 'Node.js, an open-source, cross-platform JavaScript runtime environment' },
        //         { id: '9', name: 'MongoDB, a cross-platform document-oriented database program' },
        //         { id: '10', name: 'Expo, a free and open-source platform for building native apps' },
        //         { id: '11', name: 'REST API, a standard for building web services using HTTP requests' },
        //     ],
        // }
    }

    async dataInit() {
        this.db = DB.getInstance()
        const chats = await this.db.getChats();
        console.log(chats)
        this.data = chats;
        this.setState({
            data: chats
        })
    }

    renderItem = ({ item }: { item: ListItem }) => (
        // <Pressable onPress={() => console.log(`Pressed ${item.title}`)}>
        //     <Text>{item.title}</Text>
        // </Pressable>
        <View className="flex flex-row justify-start px-5 py-1">
            <Pressable
                onPress={() => { 
                    global.currentChat = item.id;
                    this.props.navigation.navigate('Chat')
                }}
            >
                <Text className="leading-5 my-2 px-4 py-3 text-white rounded-3xl bg-white/10">{item.name}</Text>
            </Pressable>
        </View>
    );
    render() {
        return (
            <SafeAreaView className="flex-1 bg-slate-800">
                <StatusBar />
                <Header
                    navigation={this.props.navigation}
                />
                <FlatList
                    className="pt-2 pb-7"
                    data={this.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id}
                />
                <Pressable
                    className="absolute bottom-1 w-full flex flex-row justify-center items-center"
                    onPress={() => { 
                        global.currentChat = 0;
                        this.props.navigation.navigate('Chat')
                    }}
                >
                    <View className="max-w-[190px] w-full flex flex-row items-center justify-center gap-x-2 my-2 px-5 py-3 rounded-3xl bg-teal-500">
                        <Text className="font-medium text-white">Start new chat</Text>
                        <Ionicons name="ios-create" size={18} color="white" />
                    </View>
                </Pressable>
            </SafeAreaView>
        )
    }
}

export default ListScreen;