import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AiImage from '@/assets/images/ai.png'

const LinearGradientCard = ({ headline, desc, btnText, ai = false, onPress }) => {
  return (
    <View
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 }, // nur nach unten
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // für Android
    }} // styles sind nur für den shadow weil dieser bei linear gradient nicht applied, der container selber ist aber der linear gradient!!!
    >
      <LinearGradient
        colors={["#FFFFFF", "#6BB4A0"]}
        style={{
          width: '100%',
          display: "flex",
          flexDirection: 'column',
          padding: 18,
          gap: 30,
          borderRadius: 16,
        }}
      >
        <View className='flex-col gap-2'>
          <Text className='text-black font-bold text-3xl'>{headline}</Text>
          <Text className='text-[#8C8C8C] text-lg'>{desc}</Text>
        </View>
        <View className='flex-row items-center justify-center'>
          {ai ?
          <TouchableOpacity className='bg-black w-7/12 px-4 py-3 rounded-full flex-row justify-between items-center'>
          <Text className='text-white font-bold text-lg'>{btnText} </Text>
          <Image source={AiImage} className='size-6' tintColor={"white"}/>
        </TouchableOpacity>
          :
          <TouchableOpacity className='bg-black items-center justify-center w-7/12 py-3 rounded-full'>
            <Text className='text-white font-bold text-lg'>{btnText}</Text>
          </TouchableOpacity>}
        </View>
      </LinearGradient>
    </View>

  )
}

export default LinearGradientCard