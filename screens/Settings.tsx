import React, { Component } from 'react'
import { Image, Pressable, StatusBar, SafeAreaView, TextInput, View, Text, Alert } from 'react-native'
import { NavigationProp } from '@react-navigation/native';

// Helpers
import DB from '../utils/helpers/DB'

interface Props {
    navigation: NavigationProp<Record<string, object>>;
}

interface State {
    apiKey: string;
}

class SettingsScreen extends Component<Props, State> {

    private db: DB

    constructor(props: Props) {
        super(props)

        this.state = {
            apiKey: ''
        }
        this.db = DB.getInstance()
        this.dataInit()
    }

    async dataInit() {
        let apikey = await this.db.getApiKey()
        this.setState({
            apiKey: apikey
        })
    }

    handleApiKeyChange = (apiKey: string) => {
        this.setState({ apiKey });
    };

    handleSaveApiKey = async () => {
        let result = await this.db.saveApiKey(this.state.apiKey);
        if (result) {
            this.props.navigation.navigate('List');
        } else {
            Alert.alert(
                'Error',
                'Error saving API key'
              );
        }
    };

    render() {
        return (
            <SafeAreaView className="flex-1 bg-slate-800">
                <StatusBar />
                <Image
                    className="w-[100%] h-[230px]"
                    source={require('../assets/icon.png')}
                />
                <View className="px-5 py-10 flex items-center flex-col gap-y-7">
                    <TextInput
                        className="w-full p-2 color-white rounded border border-teal-300"
                        placeholderTextColor="#4DB6AC"

                        onChangeText={this.handleApiKeyChange}
                        value={this.state.apiKey}
                        placeholder="Enter your OpenAI API key"
                        secureTextEntry={true}
                    />
                    <Pressable
                        onPress={this.handleSaveApiKey}
                    >
                        <View className="w-full px-5 py-3 rounded-3xl bg-teal-500">
                            <Text className="font-medium text-white">Confirm and start chatting</Text>
                        </View>
                    </Pressable>
                    <Text className="text-center text-xs text-white">This API key can be obtained on the official OpenAI website.</Text>
                    <Text className="text-center text-xs text-amber-300">Notice: When using the OpenAI API through this application, the user is solely responsible for complying with the API usage rules provided by OpenAI. The application only provides an interface for using the API and does not control the content or context of the requests made through it. The user is required to verify the possibility of using the API in their country or region.</Text>
                    
                </View>
            </SafeAreaView>
        )
    }
}

export default SettingsScreen;