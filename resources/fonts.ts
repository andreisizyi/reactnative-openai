// Fonts
import * as Font from 'expo-font'

import {
    Roboto_400Regular,
    Roboto_700Bold
} from '@expo-google-fonts/roboto'

export default useFonts = async () => {
    await Font.loadAsync({ Roboto_700Bold, Roboto_400Regular })
}