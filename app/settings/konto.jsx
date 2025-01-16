import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Konto() {
  return (
        <View className='flex-1 bg-white'>
            
            <View>
                <View>
                    <Text>Name</Text>
                    <Text>Tom Seidel</Text>
                </View>
                <TouchableOpacity>Bearbeiten</TouchableOpacity>
            </View>

        </View>
    
  )
}