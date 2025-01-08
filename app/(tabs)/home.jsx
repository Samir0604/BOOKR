import { View, Text } from 'react-native'
import React from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Bitte from '@/components/Bitte';


const home = () => {
  return (
    <SafeAreaView className='bg-white flex-1 p-4'>
    
              <View className="mt-5">

              <View className='flex flex-row items-center border-b border-[#8C8C8C] '>
              <Text className='text-4xl font-semibold'>Aktive Bücher</Text>
              <MaterialIcons 
                name="navigate-next" 
                size={38} 
                color="#2DA786"
              />
              </View>

                <BookProgress/>
                <Bitte />
              </View>
              
           
       
        </SafeAreaView>
  )
}

export default home