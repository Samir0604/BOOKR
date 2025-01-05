import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView>

            <Link className="font-bold text-2xl" href="(auth)/onboarding">Onboarding</Link>
            <Link className="font-bold text-2xl" href="(auth)/login">Login</Link>



        </SafeAreaView>

    )
}