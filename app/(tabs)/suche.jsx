import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import editActiveBooks from '../../lib/editActiveBooks'
import { useGlobalContext } from '@/context/GlobalProvider';

const Suche = () => {

    const { user } = useGlobalContext()

  return (
    <SafeAreaView className='bg-white flex-1 p-4'>
     

          <View className="mt-20">
            <Text>suche</Text>
            <TouchableOpacity onPress={()=> editActiveBooks(user, "jsjjjj")}>
              <Text>klick für progress</Text>
            </TouchableOpacity>
          </View>
          
       
   
    </SafeAreaView>
    
  )
}

export default Suche