import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import KontoListing from '@/components/kontoListing'
import { useGlobalContext } from '@/context/GlobalProvider';


export default function Konto() {
    const { user } = useGlobalContext();
    
    console.log(user)



  return (
        <View className='flex-1 bg-white w-full'>


            <KontoListing heading="Name" value={user.fullName} buttonText="Bearbeiten" redirect="/settings/changeName"/>
            <KontoListing heading="E-Mail-Adresse" value={user.email} buttonText="Bearbeiten" redirect="/settings/changeEmail"/>
            <KontoListing heading="Passwort" value="********" buttonText="Bearbeiten" redirect="/settings/changePassword"/>
            
            <View className='flex flex-row justify-between items-center w-full mt-5 border-b pb-4 px-7 border-[#e0dfdf]'>
                    <View className='flex flex-col gap-1'>
                        <Text className='font-semibold text-lg text-[#8C8C8C]'>Konto Löschen</Text>
                    </View>
                    <TouchableOpacity>
                        <Text className='text-xl text-[#1975FF] font-medium'>Löschen</Text>
                    </TouchableOpacity>
                </View>

        </View>
    
  )
}