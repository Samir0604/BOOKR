import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalContext } from '@/context/GlobalProvider';
import getActiveBooks from '../../lib/getActiveBooks';
import AntDesign from '@expo/vector-icons/AntDesign';




export default function bibliothek() {
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true)
  const [activeBook, setActiveBook]= useState(null)


  const fetchActiveBooks = async()=>{
    try{
      const activeBook = await getActiveBooks(user);

      if(activeBook){
        setActiveBook(activeBook)
        console.log("book progress in useState")
      }else{
        console.log("user hat kein Buch aktiv")
      }

    }catch(error){
      console.log("error bei fetchen", error)
    }finally{
      setIsLoading(false);
    }
  }


  useEffect(()=>{
    fetchActiveBooks()
  },[user])


  return (
    <ScrollView className="bg-white flex-1">
      <SafeAreaView className="bg-white flex-1 p-5">
        <View className="flex-1">

          <View className="mt-12 mb-6">
            <Text className="text-4xl font-bold">Bibliothek</Text>
          </View>

          <View className="flex flex-row">
            <Text className="color-[#8C8C8C] text-2xl">Aktive Bücher</Text>
            <MaterialIcons
                name="navigate-next"
                size={34}
                color="#2DA786"
              />
          </View>

            {activeBook
            ? <View className="flex flex-row gap-5">
              
              

                <View>
                  <View className='w-44 h-72 bg-[#bebebe67] flex items-center justify-center'>
                    <AntDesign name="plus" size={34} color="#2DA786" />
                  </View>
                </View>



            </View>
            
            
            
            
            
            
            : <Text>Kein Buch da lan</Text>
          
          
          }
         


        </View>


       

      </SafeAreaView>
    </ScrollView>
   
    
  )
}