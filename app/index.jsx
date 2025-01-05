import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView className=" flex-1  ">
            <ScrollView contentContainerClassName="flex-1 flex-col gap-4 items-center justify-center">
            <Link className="font-bold text-2xl" href="(auth)/onboarding">Onboarding</Link>
            <Link className="font-bold text-2xl" href="(auth)/login">Login</Link>
            <Link className="font-bold text-2xl" href="(auth)/sign-up">Sign-up</Link>
            <Link className="font-bold text-2xl" href="(auth)/sign-up-email">Email</Link>
            </ScrollView>
 


        </SafeAreaView>

    )
}