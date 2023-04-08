import React, { Component } from 'react'
import { DeviceEventEmitter, StatusBar, SafeAreaView, Text, View, Pressable, FlatList, Alert, Vibration } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp } from '@react-navigation/native';

// Helpers
import DB from '../utils/helpers/DB'

// Components
import Header from '../components/ListHeader'

// const token: string = "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"

interface Props {
    navigation: NavigationProp<Record<string, object>>;
}

interface ListItem {
    id: number;
    name: string;
}

interface State {
    data: ListItem[];
}

class ListScreen extends Component<Props, State> {

    private db: DB
    private deleteAllListener: any
    constructor(props: Props) {
        super(props)

        this.state = {
            data: []
        }
        
        this.deleteAllListener = DeviceEventEmitter.addListener('deleteAll', () => {
            Alert.alert(
              'Confirmation of deletion',
              'Are you sure you want to delete all chats history?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Deletion cancelled'),
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => {
                    this.db.removeAllChats()
                    this.dataInit();
                  },
                  style: 'destructive',
                },
              ],
              { cancelable: false }
            );
          });
    }

    async dataInit() {
        this.db = DB.getInstance()
        const chats = await this.db.getChats()
        console.log(chats)
        this.setState({ data: chats })
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus)
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.onScreenFocus)
        this.deleteAllListener.remove()
    }

    onScreenFocus = () => {
        this.dataInit()
    };

    showAlert = (id: number) => {
        Vibration.vibrate(100)
        Alert.alert(
            'Confirmation of deletion',
            'Are you sure you want to delete this chat?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        this.db.removeChat(id)
                        this.dataInit()
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    renderItem = ({ item }: { item: ListItem }) => (
        <View className="flex flex-row justify-start px-5 py-1">
            <Pressable
                onPress={() => {
                    global.currentChat = item.id;
                    this.props.navigation.navigate('Chat')
                }}
                onLongPress={() => this.showAlert(item.id)}
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
                {!this.state.data?.length &&
                    <Text className="self-center my-4 px-4 py-3 text-white rounded-3xl bg-white/10">
                        History is empty
                    </Text>
                }
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id.toString() as string}
                    contentContainerStyle={{ paddingBottom: 96, paddingTop: 8 }}
                />
                <Pressable
                    className="absolute bottom-0.5 w-full flex flex-row justify-center items-center"
                    onPress={() => {
                        global.currentChat = 0;
                        this.props.navigation.navigate('Chat')
                    }}
                >
                    <View className="max-w-[190px] w-full flex flex-row items-center justify-center gap-x-2 my-2 px-5 py-3 rounded-3xl bg-teal-500">
                        <Text className="font-medium text-white">Start new chat</Text>
                        <Ionicons name="ios-create" size={22} color="white" />
                    </View>
                </Pressable>
            </SafeAreaView>
        )
    }
}

export default ListScreen;