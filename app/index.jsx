import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        
            <ScrollView contentContainerClassName="flex-1 flex-col gap-4 items-center justify-center ">
                <SafeAreaView className="">
                <Text className="text-5xl text-red-500 font-bold">AUTH</Text>
                <Link className="font-bold text-2xl" href="(auth)/onboarding">Onboarding</Link>
                <Link className="font-bold text-2xl" href="(auth)/login">Login</Link>
                <Link className="font-bold text-2xl" href="(auth)/sign-up">Sign-up</Link>
                <Link className="font-bold text-2xl" href="(auth)/sign-up-email">Email</Link>

                <Text className="text-5xl text-green-500 font-bold text-center">FURTHER ONBOARDING</Text>

                <Link className="font-bold text-2xl" href="questions/swiper">Swiper</Link>
                <Link className="font-bold text-2xl" href="questions/categories">Cats</Link>

                <Text className="text-5xl text-blue-500 font-bold text-center">TABS</Text>
                <Link className="font-bold text-2xl" href="/(tabs)/home">Home</Link>
                <Link className="font-bold text-2xl" href="/(tabs)/bibliothek">Bibliothek</Link>
                <Link className="font-bold text-2xl" href="/(tabs)/suche">Suche</Link>
                <Link className="font-bold text-2xl" href="/(tabs)/profil">Profil</Link>



                <Text className="text-5xl text-blue-500 font-bold text-center">Account</Text>
                <Link className="font-bold text-2xl" href="settings/konto">Konto lan</Link>
                <Link className="font-bold text-2xl" href="settings/support">Konto lan</Link>
                <Link className="font-bold text-2xl" href="settings/privacy">Konto lan</Link>
                <Link className="font-bold text-2xl" href="settings/businessInfo">Konto lan</Link>
                <Link className="font-bold text-2xl" href="settings/changeEmail">EMail</Link>
                <Link className="font-bold text-2xl" href="settings/deleteAccount">deleteAccount</Link>










                </SafeAreaView>
            </ScrollView>



        

    )
}