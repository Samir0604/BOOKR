import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ZurSammlung from '@/components/ZurSammlung';
import Empfehlungen from '@/components/Empfehlungen';
import likeBook from '@/lib/buchMerken';
import { useGlobalContext } from '@/context/GlobalProvider';





const home = () => {
  const { user } = useGlobalContext()


  return (

    <ScrollView className='bg-white flex-1'>


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

          <BookProgress />
          <ZurSammlung />
          <Empfehlungen />

          <TouchableOpacity onPress={() => likeBook(user, 'hahahoho')}><Text>Hi</Text></TouchableOpacity>


        </View>




      </SafeAreaView>
    </ScrollView>
  )
}

export default home