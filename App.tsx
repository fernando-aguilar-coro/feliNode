import { ActionSheetIOS, SafeAreaView, StyleSheet, Text } from "react-native";
import { LessonScreen } from "./src/features/lesson/screens/LessonScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const App = () => {
    return (
        <SafeAreaProvider>
            <LessonScreen />
        </SafeAreaProvider>
    );
}
