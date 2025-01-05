import { Slot, Stack } from "expo-router";
import "../global.css"
export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Default App" }}></Stack.Screen>
            <Stack.Screen name="(auth)" options={{ title: "auth" }}></Stack.Screen>
        </Stack>
    )
}