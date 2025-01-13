import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalContext } from '@/context/GlobalProvider';
import getActiveBooks from '../../lib/getActiveBooks';
import AntDesign from '@expo/vector-icons/AntDesign';
import BookListingLib from '@/components/bookListingLib';
import AddBookLib from '@/components/addBookLib';

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2DA786" />
        <Text className="mt-4 text-lg color-[#8C8C8C]">Lade Bibliothek...</Text>
      </View>
    )
  }

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
                <BookListingLib activeBook={activeBook}/>
                <AddBookLib />
              </View>
            
            : <AddBookLib />
          }


          <View className="flex flex-row mt-8">
            <Text className="color-[#8C8C8C] text-2xl">Gemerkt</Text>
            <MaterialIcons
              name="navigate-next"
              size={34}
              color="#2DA786"
            />
          </View>


          {activeBook

          ? <View className="flex flex-row gap-5">
              {activeBook.map((savedBook) => (    // Runde Klammern statt geschweifter
                <BookListingLib 
                key={savedBook.$id}             // Eindeutiger key hinzugefügt
                activeBook={savedBook}
                />
              ))}
              <AddBookLib />
            </View>
  
          : <AddBookLib />
          }




        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
