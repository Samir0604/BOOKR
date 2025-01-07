import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { router } from 'expo-router'
import Apple from "@/assets/loginprovider/apple.png"
import Facebook from "@/assets/loginprovider/facebook.png"
import Google from "@/assets/loginprovider/google.png"
import Spotify from "@/assets/loginprovider/spotify.png"
import { signUpWithEmail } from '@/lib/auth'



const RoundedImage = ({ image }) => {
    return (

        <View className='w-16 h-16 bg-white rounded-full justify-center items-center mr-2 border border-black'>
            <Image source={image} style={{ width: '55%', height: '55%', borderRadius: 50 }} />
        </View>

    )
}

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")



    const Register = async () => {

        if (!email || !password || !fullName || !passwordConfirm) {
            Alert.alert("please fill in all the information")
            return;
        }

        if (password != passwordConfirm) {
            Alert.alert("passwords do not match ")
            return
        }


        try {
            const response = await signUpWithEmail(fullName.trim(), email.trim(), password.trim())
            if (response) {
                Alert.alert("good")
            } else {
                Alert.alert("bad")
            }
        } catch (error) {
            console.log(error)
        }


    }

    return (
        <SafeAreaView className='bg-white flex-1'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <ScrollView contentContainerClassName='mt-12 flex-col bg-white items-center flex-1'>

                    <View className='mx-6'>
                        <Text className='font-bold mb-3' >Hallo und willkommen bei BOOKR</Text>
                        <Text>Wir bei Bookr helfen dir, dein perfektes Leseerlebnis zu schaffen. Von Abenteur, bis hinzu Romantik, begleiten wir dich </Text>
                    </View>


                    <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Vor- und Nachname"
                        className="mt-12 w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white  " />


                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="E-Mail-Adresse"
                        className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3" />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Passwort"
                        className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3" />


                    <TextInput
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry
                        placeholder="Passwort bestätigen"
                        className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3" />




                    <TouchableOpacity onPress={Register} className='p-4 mt-7 bg-[#1975FF] rounded-2xl w-[70%]'>
                        <Text className='color-white text-center text-xl'>Registrieren</Text>
                    </TouchableOpacity>


                    <View className='mt-3'>
                        <Text>Du hast schon einen Account? <Text className='color-[#1975FF] font-semibold' onPress={() => {
                            router.push("(auth)/login")
                        }}>Login</Text></Text>
                    </View>

                    <View className='mt-3'>
                        <Text className='color-[#8C8C8C]'>oder</Text>
                    </View>

                    <View className='flex-row mt-2'>
                        <RoundedImage image={Spotify} />
                        <RoundedImage image={Facebook} />
                        <RoundedImage image={Google} />
                        <RoundedImage image={Apple} />
                    </View>


                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>

    )
}

export default LoginPage