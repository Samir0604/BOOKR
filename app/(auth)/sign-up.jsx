import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'

import Logo from "@/assets/logo/TemporaryBOOKRLogo.png"
import Google from "@/assets/loginprovider/google.png"
import Apple from "@/assets/loginprovider/apple.png"
import Facebook from "@/assets/loginprovider/facebook.png"
import Spotify from "@/assets/loginprovider/spotify.png"
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router'
import { loginWithGoogle } from '@/lib/auth'


const Buttons = ({ name, provider, mail = false, handleProvider }) => {

  const handleLogin = async () => {
    const result = await handleProvider();


    if (!result) {
      Alert.alert("Error", "Failed to login");
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (mail) {
          router.push("/sign-up-email")
        } else {
          handleLogin()
        }
      }}
      className='border rounded-3xl py-4  items-center flex-row'>
      <View className='flex-row items-center ml-[21%]'>
        {!mail ? <Image source={provider} className='size-9' /> : <Feather name="mail" size={28} color="black" className='ml-0.5 mr-0.5' />}
        <Text className='font-bold text-xl ml-3'>Weiter mit {name}</Text>
      </View>
    </TouchableOpacity>
  )
}

{/* <Feather name="mail" size={24} color="black" /> */ }

const LoginPage = () => {


  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView contentContainerClassName='flex-1 flex-col items-center  bg-white'>
        <Image source={Logo} />
        <Text className='text-2xl color-[#8C8C8C] font-semibold'>Jetzt bei BOOKR registrieren</Text>

        <View className='w-full px-8 gap-4 mt-12'>

          <Buttons name={"Google"} provider={Google} handleProvider={loginWithGoogle} />

          <Buttons name={"Apple"} provider={Apple} />

          <Buttons name={"Facebook"} provider={Facebook} />

          <Buttons name={"Spotify"} provider={Spotify} />

          <Buttons name={"E-Mail"} provider={null} mail={true} />

        </View>
        <View className='mt-3'>
          <Text className='text-gray-500'>Du hast schon einen Account? <Text className='color-[#1975FF] font-semibold'>Login</Text></Text>
        </View>

      </ScrollView>
    </SafeAreaView>

  )
}

export default LoginPage