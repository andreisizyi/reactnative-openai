import React, { Component, ReactNode } from 'react';
import { Animated, Text, TextInput, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type ChatRequestProps = {
  isRequesting: boolean
  sendRequest: (prompt: string | null) => void
  stopResponse: () => void
};

type ChatRequestState = {
  prompt: string | null
};

class ChatRequest extends Component<ChatRequestProps, ChatRequestState> {
  opacity: Animated.Value;

  constructor(props: ChatRequestProps) {
    super(props);
    this.state = {
      prompt: null,
    }

    this.opacity = new Animated.Value(1)
  }

  submit = (): void => {
    this.props.sendRequest(this.state.prompt)
    this.setState({ prompt: null })
  };

  startAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  public stopAnimation() {
    this.opacity.stopAnimation(() => {
      this.opacity.setValue(1)
    });
  }

  componentDidUpdate(prevProps: ChatRequestProps): void {
    // Animate button
    if (this.props.isRequesting !== prevProps.isRequesting) {
      if (this.props.isRequesting) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }

  render(): ReactNode {
    const { isRequesting } = this.props;
    const { prompt } = this.state;

    return (
      <Animated.View
        className="absolute bottom-0 h-[70px] px-3 py-2 w-full flex flex-row justify-between items-center"
        style={{ opacity: this.opacity }}>
        {!isRequesting ? (
          <TextInput
            className="w-full px-3 py-3 pr-14 bg-slate-900 rounded-3xl text-md text-white"
            onChangeText={(text) => this.setState({ prompt: text })}
            value={prompt}
            placeholder="Write a message ..."
            placeholderTextColor="rgb(107 114 128)"
            multiline={false}
          />
        ) : (
          <Pressable
            onPress={this.props.stopResponse}
            className="m-auto flex justify-center bg-red-500 active:opacity-50 rounded-3xl px-3 py-3"
          >
            <Text className="text-md text-white">Stop responding</Text>
          </Pressable>
        )}
        {!isRequesting && prompt && (
          <Pressable
            className="absolute h-[38px] w-[38px] right-5 pl-1 flex justify-center items-center rounded-full bg-teal-500 active:opacity-50"
            onPress={this.submit}
          >
            <Ionicons name="ios-send" size={22} color="white" />
          </Pressable>
        )}
      </Animated.View>
    );
  }
}

export default React.memo(ChatRequest);