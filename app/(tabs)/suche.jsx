import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BookProgress from '@/components/BookProgress'

const Suche = () => {
  return (
    <SafeAreaView className='bg-white'>
        <View className='bg-white'>
          <Text>suche</Text>
          <BookProgress />
        </View>
    </SafeAreaView>
    
  )
}

export default Suche