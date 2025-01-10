import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ZurSammlung from '@/components/ZurSammlung';
import Empfehlungen from '@/components/Empfehlungen';





const home = () => {


  return (

    <ScrollView className='bg-white flex-1'>
      <SafeAreaView>

              <View className='flex flex-row items-center border-b border-[#8C8C8C] '>
              <Text className='text-4xl font-semibold'>Aktive Bücher</Text>
              <MaterialIcons 
                name="navigate-next" 
                size={38} 
                color="#2DA786"
              />
              </View>
                <Text>Hallo</Text>
                <BookProgress/>
                <ZurSammlung />
                <Empfehlungen />
             
              
           
        
       
        </SafeAreaView>
        </ScrollView>
  )
}

export default home