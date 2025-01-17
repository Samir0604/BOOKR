import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import KontoListing from '@/components/kontoListing'

export default function Konto() {
  return (
        <View className='flex-1 bg-white w-full'>


            <KontoListing heading="Name" value="Tom Seidel" buttonText="Bearbeiten"/>
            <KontoListing heading="E-Mail-Adresse" value="tomseidel615@gmail.com" buttonText="Bearbeiten"/>
            <KontoListing heading="Passwort" value="********" buttonText="Bearbeiten"/>
            
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