import { Slot, Stack } from "expo-router";
import { GlobalProvider } from "@/context/GlobalProvider";
import "../global.css"
export default function RootLayout() {
    return (
        <GlobalProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ title: "Default App" }}></Stack.Screen>
                <Stack.Screen name="(auth)" options={{ title: "auth" }}></Stack.Screen>
                <Stack.Screen name="search/[input]" options={{ title: "" }}></Stack.Screen>

            </Stack>
        </GlobalProvider>
    )
}