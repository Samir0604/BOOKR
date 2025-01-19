import { View, Text, FlatList, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBookStore from '@/stores/zustandBookHandling';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function CategorySearch() {
  const { category } = useLocalSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const setSelectedBook = useBookStore((state) => state.setSelectedBook);

  const isValidBook = (book) => {
    return (
      book.volumeInfo?.title &&
      book.volumeInfo?.authors?.length > 0 &&
      book.volumeInfo?.imageLinks?.thumbnail &&
      book.volumeInfo?.description &&
      book.volumeInfo?.categories
    );
  };

  const getBooksByCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: `subject:${category}`,
          maxResults: 20,
          orderBy: 'relevance',
          langRestrict: 'de',
          key: API_KEY
        }
      });

      const validBooks = response.data.items?.filter(isValidBook) || [];
      setBooks(validBooks);

    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      getBooksByCategory();
    }
  }, [category]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 bg-white'>
      <Animated.View
        className='absolute top-0 left-0 right-0 z-50'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }}
      >
        <BlurView intensity={20} tint="light" className='absolute top-0 left-0 right-0 bottom-0' />
        <LinearGradient
          colors={['#87BAAC', 'rgba(255,255,255,0.8)']}
          className='w-full'
        >
          <SafeAreaView>
            <View className='flex-row items-center justify-between px-5 mt-3 h-6'>
              <TouchableOpacity onPress={() => { router.back() }}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
              <Text className='text-base font-medium'>{category}</Text>
              <View className='w-8' />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>


      <Animated.View
        className='absolute top-0 left-0 z-50 p-5 pt-3'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}
      >
        <SafeAreaView>
          <TouchableOpacity onPress={() => { router.back() }}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

       

      <Animated.FlatList
        data={loading ? [] : books}
        contentContainerClassName='p-5 gap-3'
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={() => (
          <>
            <View className='h-12' />

            <View className='flex items-center mb-3'>
                <Text className='font-semibold text-4xl '>{category}</Text>
            </View>




            {loading ? (
              <View className='justify-center items-center py-8'>
                <ActivityIndicator size="large" color="#2DA786" />
                <Text className='text-gray-600 mt-4'>Suche nach Büchern...</Text>
              </View>
            ) : books.length === 0 ? (
              <View className='justify-center items-center py-8'>
                <Text className='text-gray-600 text-lg'>Keine Bücher gefunden</Text>
              </View>
            ) : null}
          </>
        )}
        renderItem={({ item, index }) => {
          const title = item.volumeInfo.title;
          const thumbnail = item.volumeInfo.imageLinks.thumbnail;
          const authors = item.volumeInfo.authors;
          const categories = item.volumeInfo.categories;

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedBook(item);
                router.push({
                  pathname: `/bookpage/${item.id}`
                });
              }}
              className='w-full'
            >
            

              <View className='flex-row space-x-4'>
                <Image
                  source={{ uri: thumbnail }}
                  className='w-20 h-28 rounded-lg'
                  resizeMode='cover'
                />
                <View className='flex-1 py-2 ml-2'>
                  <Text className='text-lg font-semibold mb-1'>{title}</Text>
                  <Text className='text-gray-600 mb-1'>{authors[0]}</Text>
                  <Text className='text-gray-400 text-sm'>
                    {categories[0]}
                    {categories[1] ? ` | ${categories[1]}` : ''}
                    {categories[2] ? ` | ${categories[2]}` : ''}
                  </Text>
                  {index === 0 ? (
                    <>
                      <View className='absolute top-0 left-1 right-0 border-b border-gray-200' />
                      <View className='absolute bottom-0 left-1 right-0 border-b border-gray-200' />
                    </>
                  ) : (
                    <View className='absolute bottom-0 left-1 right-0 border-b border-gray-200' />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
