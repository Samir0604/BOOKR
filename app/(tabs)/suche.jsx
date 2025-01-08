import { View, Text } from 'react-native'
import React from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'

const Suche = () => {
  return (
    <SafeAreaView className='bg-white flex-1 p-4'>
     

          <View className="mt-20">
            <Text>suche</Text>
            <BookProgress />
          </View>
          
       
   
    </SafeAreaView>
    
  )
}

export default Suche