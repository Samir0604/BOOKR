import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function KontoListing({heading, value, buttonText}) {
  return (
    <View className='flex flex-row justify-between items-center w-full mt-5 border-b pb-4 px-7 border-[#e0dfdf]'>
        <View className='flex flex-col gap-1'>
            <Text className='font-semibold text-xl'>{heading}</Text>
            <Text className='text-[#8C8C8C]'>{value}</Text>
        </View>
        <TouchableOpacity>
            <Text className='text-xl text-[#1975FF] font-medium'>{buttonText}</Text>
        </TouchableOpacity>
    </View>
  )
}