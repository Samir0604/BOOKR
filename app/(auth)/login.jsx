import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { signIn } from '@/lib/auth'

import Spotify from "@/assets/loginprovider/spotify.png"
import Google from "@/assets/loginprovider/google.png"
import Apple from "@/assets/loginprovider/apple.png"
import Facebook from "@/assets/loginprovider/facebook.png"



const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const Login = async () => {

        if (!email || !password) {
            Alert.alert("please fill in all the information")
            return;
        }

        try {
            const response = await signIn(email.trim(), password.trim())
            if (response) {
                Alert.alert("good")
            }
        } catch (error) {
            Alert.alert("Error", "Invalid Credentials")
        }

    }




    const RoundedImage = ({ image }) => {
        return (

            <View className='w-16 h-16 bg-white rounded-full justify-center items-center mr-2 border border-black'>
                <Image source={image} style={{ width: '55%', height: '55%', borderRadius: 50 }} />
            </View>

        )
    }

    return (
        <SafeAreaView className='bg-white flex-1'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerClassName='mt-3 flex-col bg-white items-center flex-1'
                >

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="E-Mail-Adresse"
                        className="mt-12 w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white  " />


                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Passwort"
                        className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3" />

                    <View className="w-5/6 mt-2">
                        <Text className="text-left color-[#1975FF] font-semibold">Passwort vergessen?</Text>
                    </View>


                    <TouchableOpacity onPress={Login} className='p-4 mt-7 bg-[#1975FF] rounded-2xl w-[70%]'>
                        <Text className='color-white text-center text-xl'>Login</Text>
                    </TouchableOpacity>


                    <View className='mt-3'>
                        <Text>Noch keinen Account? <Text className='color-[#1975FF] font-semibold' onPress={() => {
                            router.push("(auth)/sign-up")
                        }}>Registrieren</Text></Text>
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