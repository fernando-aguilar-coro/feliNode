
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const LoadingScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text> loading ... </Text>
            </View>
        </SafeAreaView>
    );
}