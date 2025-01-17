import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalContext } from '@/context/GlobalProvider';
import getActiveBooks from '../../lib/getActiveBooks';
import AntDesign from '@expo/vector-icons/AntDesign';
import BookListingLib from '@/components/bookListingLib';
import AddBookLib from '@/components/addBookLib';
import getSavedBooks from '@/lib/getSavedBooks';
import useBookStore from '@/stores/zustandBookHandling';
export default function bibliothek() {
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true)
  const [activeBook, setActiveBook] = useState(null)
  const [savedBooks, setSavedBooks] = useState(null)

  const shouldRefresh = useBookStore((state) => state.shouldRefresh);
  const setShouldRefresh = useBookStore((state) => state.setShouldRefresh);




  async function fetchBooks() {
    try {
      const [activeBook, savedBooks] = await Promise.all([
        getActiveBooks(user),
        getSavedBooks(user)
      ]);

      setActiveBook(activeBook || null);
      setSavedBooks(savedBooks || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setActiveBook(null);
      setSavedBooks([]);
    } finally {
      setIsLoading(false);
      setShouldRefresh(false); // Reset shouldRefresh after fetching data
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [user]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchBooks();
      console.log('sup nig');

    }
  }, [shouldRefresh]);



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
            ? <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex"
            >
              <View className="flex flex-row gap-5">
                <BookListingLib book={activeBook} />
                <AddBookLib />
              </View>

            </ScrollView>

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




          {savedBooks
            ? <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex"
            >

              <View className="flex flex-row gap-5">
                {savedBooks.map((savedBook, index) => {
                  return (
                    <BookListingLib key={index} book={savedBook} />
                  )
                })}
                <AddBookLib />
              </View>

            </ScrollView>

            : <AddBookLib />

          }







        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
