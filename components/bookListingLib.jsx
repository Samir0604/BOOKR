import { View, Text, Image } from 'react-native'
import React from 'react'

export default function BookListingLib({activeBook}) {
  return (
    <View className="flex flex-col">

      <View className="shadow-xl shadow-black/50">
        <Image source={{uri: activeBook.image}} className='w-44 h-72'/>
        
      </View>
   
      <Text className="mt-2 text-xl font-bold">{activeBook.title}</Text>
      <Text className="color-[#8C8C8C]">{activeBook.authors}</Text>
   
    </View>
  )
}