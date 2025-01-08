import { View, Text, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'


export default function BookProgress() {
  return (
    <LinearGradient 
    colors={["#ffffff", "#6BB4A0"]}
   style={{
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50',
    borderRadius: 25,
    alignSelf: 'center'
    }}>
   
    
    <View className='flex flex-row p-7'>
        <Image className='h-[251px] w-[158px]' source={require("@/assets/images/BuchBeispiel.png")}/>
        <View className='flex flex-col items-center'>

            <View className='flex flex-col justify-start gap-0'>
                <Text className='text-3xl font-bold '> Lichtenstein</Text>
                <Text className='text-xl font-bold color-[#8C8C8C]'> Simon Karper</Text>
            </View>

        </View>
       
        </View>
    </LinearGradient>
  )
}