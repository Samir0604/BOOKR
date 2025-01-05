import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const onboarding = () => {
  return (
    <View className='bg-green-500 flex-1'>

      <View className='flex-1 items-center justify-center'>
        <Image source={require('@/assets/logo/TemporaryBOOKRLogo.png')} className='size-50' />
      </View>
      
      <View className='bg-white flex-1'>

      </View>

    </View>
  )
}

export default onboarding