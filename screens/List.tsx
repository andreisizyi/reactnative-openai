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
    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }
    
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.onScreenFocus);
    }
    
    onScreenFocus = () => {
        this.dataInit();
    };

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

            <Pressable
                onPress={async () => { 
                    await this.db.removeChat(item.id)
                    
                }}
            >
                <Text className="leading-5 my-2 px-4 py-3 text-white rounded-3xl bg-white/10">Delete</Text>
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