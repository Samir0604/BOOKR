import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradientCard from '@/components/LinearGradientCard'
import Logo from '@/assets/logo/TemporaryBOOKRLogo.png'
import { useGlobalContext } from '@/context/GlobalProvider'
import { useRootNavigationState } from 'expo-router'


const SettingsButton = ({ setting, onPress }) => (
  <View className={`px-1 py-3.5 ${setting == 'Ausloggen' ? '' : 'border-b border-b-[#8C8C8C]'} `}>
    <TouchableOpacity>
      <Text className={`text-xl ${setting == 'Ausloggen' ? 'text-red-500' : 'text-black'} font-semibold`}>{setting}</Text>
    </TouchableOpacity>
  </View>
)


const profil = () => {

  const { user } = useGlobalContext()

  console.log(useRootNavigationState);



  return (
    <ScrollView className='flex-1 bg-white'>
      <SafeAreaView className='p-5 flex-1'>

        <View className='w-full items-center mb-8'>
          <Image source={Logo} className='size-60' />
          <Text className='font-bold text-black text-3xl text-center -mt-7'>Hallo {user?.fullName.split(' ')[0]}</Text>
          <Text className='text-[#80BFAE] text-lg'> Mitglied seit {new Date(user?.$createdAt).getFullYear()}</Text>
        </View>

        <LinearGradientCard headline="Deine Sammlung" desc='Lese Bücher und erhalte Belohnungen' btnText='zur Sammlung' />

        <View className='mt-8 bg-white p-4'>
          <Text className='text-black text-3xl font-bold'>Einstellungen</Text>

          <View className='mt-5 '>
            <SettingsButton setting='Konto' />
            <SettingsButton setting='Abonnement' />
            <SettingsButton setting='Benachrichtigungen' />
            <SettingsButton setting='Sprache' />
            <SettingsButton setting='FAQ' />
            <SettingsButton setting='Geschäftsbedingungen' />
            <SettingsButton setting='Datenschutz' />
            <SettingsButton setting='Ausloggen' />
          </View>

        </View>

      </SafeAreaView>
    </ScrollView>
  )
}

export default profil