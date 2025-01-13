import { View, Text } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function AddBookLib() {
  return (
    <View>
        <View className='w-44 h-72 bg-[#bebebe67] flex items-center justify-center'>
            <AntDesign name="plus" size={34} color="#2DA786" />
        </View>
    </View>
  )
}