import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Logo from "@/assets/logo/TemporaryBOOKRLogo.png"

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

  return (
    <SafeAreaView className='bg-white'>
        <View className='h-full flex-col items-center justify-center bg-white'>
            <Image source={Logo}/>
            <Text className='text-2xl color-[#8C8C8C] font-semibold'>Jetzt bei BOOKR registrieren</Text>


            <View>
              <View></View>
            </View>
       
        </View>
    </SafeAreaView>
    
  )
}

export default LoginPage