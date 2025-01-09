import { View, Text } from 'react-native'
import React from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'

const Suche = () => {
  return (
    <SafeAreaView className='bg-white flex-1 p-4'>
     

          <View className="mt-20">
            <Text>suche</Text>


            <BookModal>
           
           <View>
              <Text>Das hier ist mein modal</Text>

              <Pressable onPress={()=>{}}>
                <Text>Close</Text>
              </Pressable>

            </View>
            
           </BookModal>



           
          </View>
          
       
   
    </SafeAreaView>
    
  )
}

export default Suche