import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BookProgress from '@/components/BookProgress'

const Suche = () => {
  return (
    <SafeAreaView>
        <View>
          <Text>suche</Text>
          <BookProgress />
        </View>
    </SafeAreaView>
    
  )
}

export default Suche