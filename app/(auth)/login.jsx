import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Logo from "@/assets/logo/TemporaryBOOKRLogo.png"

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")




const RoundedImage = ()=>{
    return(
        
                    <View className='w-14 h-14 bg-gray-200 rounded-full justify-center items-center'>
                        <Image />
                    </View>
            
    )
}

  return (
    <SafeAreaView className='bg-white'>
        <View className='h-full flex-col items-center justify-center bg-white'>
            <Image source={Logo}/>
            <Text className='text-2xl color-[#8C8C8C] font-semibold'>Jetzt bei BOOKR anmelden</Text>

            <TextInput 
            value = {email}
            onChangeText={setEmail}
            placeholder = "E-Mail-Adresse" 
            className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3 "/>
            

            <TextInput 
            value = {password}
            onChangeText={setPassword}
            placeholder = "Passwort" 
            className="w-5/6 rounded-xl border-[0.5px] font-medium border-[#8C8C8C] p-4 bg-white mt-3"/>

            <View className="w-5/6 mt-2">
                <Text className="text-left color-[#1975FF] font-semibold">Passwort vergessen?</Text>
            </View>


            <TouchableOpacity className='p-4 mt-7 bg-[#1975FF] rounded-2xl w-[70%]'>
                <Text className='color-white text-center text-xl'>Login</Text>
            </TouchableOpacity>


            <View className='mt-3'>
                <Text>Noch keinen Account? <Text className='color-[#1975FF] font-semibold'>Registrieren</Text></Text>
            </View>

            <View className='mt-3'>
                <Text className='color-[#8C8C8C]'>oder</Text>
            </View>

            <View className='flex-row mt-2'>
                <RoundedImage />
                <RoundedImage />
                <RoundedImage />
                <RoundedImage />
            </View>

            
            
            
        </View>
    </SafeAreaView>
    
  )
}

export default LoginPage