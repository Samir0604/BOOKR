import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradientCard from '@/components/LinearGradientCard'
import Logo from '@/assets/logo/TemporaryBOOKRLogo.png'
const profil = () => {
  return (
    <ScrollView className='flex-1 bg-white'>
    <SafeAreaView className='p-5 flex-1'>
   

        <View className='w-full items-center mb-8'>
          <Image source={Logo} className='size-60' />
          <Text className='font-bold text-black text-3xl text-center -mt-7'>Hallo Samir</Text>
          <Text className='text-[#80BFAE] text-lg'>Mitglied seit 2024</Text>
        </View>

        <LinearGradientCard headline="Deine Sammlung" desc='Lese Bücher und erhalte Belohnungen' btnText='zur Sammlung' />

        <View className='mt-8 bg-white'>
          <Text className='text-black text-3xl font-bold'>Einstellungen</Text>

          <View>
            
          </View>
        </View>
     
    </SafeAreaView>
    </ScrollView>
  )
}

export default profil