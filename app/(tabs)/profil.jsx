import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradientCard from '@/components/LinearGradientCard'
import Logo from '@/assets/logo/TemporaryBOOKRLogo.png'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router, useRootNavigationState } from 'expo-router'

import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { Logout } from '@/lib/logout'





// const ProfileStats = ({ number, label }) => (
//   <View className="items-center">
//     <Text className="text-2xl font-bold text-[#2DA786]">{number}</Text>
//     <Text className="text-gray-600 text-sm">{label}</Text>
//   </View>
// )


// <ProfileStats number="12" label="Gelesene Bücher" />
// <View className="h-12 w-[1px] bg-gray-200" />
// <ProfileStats number="3" label="Aktuelle Bücher" />
// <View className="h-12 w-[1px] bg-gray-200" />
// <ProfileStats number="158" label="Lesestunden" />


const SettingsButton = ({ setting, icon, route, logout=false  }) => (
  <TouchableOpacity
    onPress={logout? ()=>Logout() : ()=>router.push(route)}

    className={`flex-row items-center justify-between px-4 py-6 ${setting == 'Ausloggen' ? 'rounded-b-2xl' : 'border-b border-b-[#e5e5e5]'} ${setting == 'Konto' ? 'rounded-t-2xl' : ''}`}
    style={{
      backgroundColor: setting == 'Ausloggen' ? '#FFF5F5' : 'white',
      
    }}
  >
    <View className="flex-row items-center gap-3">
      <Ionicons 
        name={icon} 
        size={22} 
        color={setting == 'Ausloggen' ? '#EF4444' : '#2DA786'} 
      />
      <Text className={`text-lg ${setting == 'Ausloggen' ? 'text-red-500' : 'text-gray-700'} font-medium`}>
        {setting}
      </Text>
    </View>
    <MaterialIcons 
      name="chevron-right" 
      size={24} 
      color={setting == 'Ausloggen' ? '#EF4444' : '#2DA786'} 
    />
  </TouchableOpacity>
)


const profil = () => {

  const { user } = useGlobalContext()




  return (
    <ScrollView className='flex-1 bg-white'>
      <SafeAreaView className='p-5 flex-1 bg-white'>

        <View className='w-full items-center mb-8'>
          <Image source={Logo} className='size-60' />
          <Text className='font-bold text-black text-3xl text-center -mt-7'>Hallo {user?.fullName.split(' ')[0]}</Text>
          <Text className='text-[#80BFAE] text-lg'> Mitglied seit {new Date(user?.$createdAt).getFullYear()}</Text>
        </View>

        <LinearGradientCard headline="Deine Sammlung" desc='Lese Bücher und erhalte Belohnungen' btnText='zur Sammlung' />

     {/* Settings Section */}
     <View className='mt-8 bg-white '>
    <Text className='text-gray-800 text-2xl font-bold mb-4'>Einstellungen</Text>
    <View className='bg-white rounded-2xl'
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <SettingsButton setting='Konto' icon="person-outline" route="settings/konto"/>
      <SettingsButton setting='Support' icon="help-circle-outline" route="settings/support"/>
      <SettingsButton setting='Geschäftsbedingungen' icon="document-text-outline" route="settings/businessInfo"/>
      <SettingsButton setting='Datenschutz' icon="shield-outline" route="settings/privacy"/>
      <SettingsButton setting='Ausloggen' icon="log-out-outline" logout={true}/>
    </View>
  </View>

  <View className="h-8" /> {/* Bottom Spacing */}
</SafeAreaView>
</ScrollView>
)
}


export default profil