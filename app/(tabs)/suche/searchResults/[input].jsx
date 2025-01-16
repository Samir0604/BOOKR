import { View, Text, FlatList, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBookStore from '@/components/zustandBookHandling';


const STORAGE_KEYS = {
  TITLE: 'searchResults_title_',
  AUTOR: 'searchResults_author_',
  KATEGORIE: 'searchResults_category_'
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 Stunde
const MAX_CACHE_ITEMS = 50;

const API_KEY = process.env.API_KEY;

const SearchPage = () => {
  const { input } = useLocalSearchParams();
  const [filter, setFilter] = useState('Titel');
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

  const cleanupOldCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const searchKeys = keys.filter(key =>
        key.startsWith('searchResults_')
      );

      for (const key of searchKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp > CACHE_DURATION) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  };

  const limitCacheSize = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const searchKeys = keys.filter(key =>
        key.startsWith('searchResults_')
      );

      if (searchKeys.length > MAX_CACHE_ITEMS) {
        const toRemove = searchKeys.length - MAX_CACHE_ITEMS;
        for (let i = 0; i < toRemove; i++) {
          await AsyncStorage.removeItem(searchKeys[i]);
        }
      }
    } catch (error) {
      console.error('Cache limit error:', error);
    }
  };

  const getCachedResults = async (filterType, searchInput) => {
    try {
      const storageKey = `${STORAGE_KEYS[filterType.toUpperCase()]}_${searchInput}`;
      const cached = await AsyncStorage.getItem(storageKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;

        if (!isExpired) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache reading error:', error);
      return null;
    }
  };

  const setCachedResults = async (filterType, searchInput, data) => {
    try {
      const storageKey = `${STORAGE_KEYS[filterType.toUpperCase()]}_${searchInput}`;
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(storageKey, JSON.stringify(cacheData));
      await limitCacheSize();
    } catch (error) {
      console.error('Cache writing error:', error);
    }
  };

  const getBooks = async () => {
    try {
      setLoading(true);

      // Prüfe Cache zuerst
      const cachedResults = await getCachedResults(filter, input);
      if (cachedResults) {
        setBooks(cachedResults);

        setLoading(false);
        return;
      }

      let searchQuery = '';
      switch (filter.toLowerCase()) {
        case 'titel':
          searchQuery = `intitle:"${input}"`;
          break;
        case 'autor':
          searchQuery = `inauthor:"${input}"`;
          break;
        case 'kategorie':
          searchQuery = `subject:"${input}"`;
          break;
        default:
          searchQuery = input;
      }

      const firstResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: searchQuery,
          maxResults: 20,
          orderBy: 'relevance',
          langRestrict: 'de',
          startIndex: 0,
          key: API_KEY
        }
      });

      const secondResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: searchQuery,
          maxResults: 20,
          orderBy: 'relevance',
          langRestrict: 'de',
          startIndex: 20,
          key: API_KEY

        }
      });

      let allBooks = [];

      if (firstResponse.data?.items) {
        allBooks = [...firstResponse.data.items];
      }

      if (secondResponse.data?.items) {
        allBooks = [...allBooks, ...secondResponse.data.items];
      }

      if (allBooks.length > 0) {
        const validBooks = allBooks.filter(isValidBook).filter((book, index, self) =>
          index === self.findIndex((b) => b.volumeInfo.title === book.volumeInfo.title)
        );

        if (filter === 'Titel') {
          const enrichedBooks = await Promise.all(
            validBooks.map(async (book) => {
              try {
                const exactResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                  params: {
                    q: `intitle:"${book.volumeInfo.title}"`,
                    langRestrict: 'de',
                    maxResults: 1,
                    orderBy: 'relevance',
                    key: API_KEY

                  }
                });

                if (exactResponse.data?.items?.[0] && isValidBook(exactResponse.data.items[0])) {
                  return exactResponse.data.items[0];
                }
                return book;
              } catch (error) {
                console.error('Exact search error:', error);
                return book;
              }
            })
          );

          setBooks(enrichedBooks);
          await setCachedResults(filter, input, enrichedBooks);
        } else {

          setBooks(validBooks);
          await setCachedResults(filter, input, validBooks);
        }
      } else {
        setBooks([]);
      }

    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cleanupOldCache();
    if (input) {
      getBooks();
    }
  }, [input]);

  useEffect(() => {
    if (input) {
      getBooks();
    }
  }, [filter]);

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
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text className='text-base font-medium'>{input}</Text>
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
            <AntDesign name="arrowleft" size={24} color="black" />
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
            <View className='mb-4'>
              <SearchInput oldSearch={input} />
            </View>

            <View className='flex-row gap-3 mb-8'>
              <TouchableOpacity
                className={`${filter == 'Titel' ? 'bg-[#2DA786]' : ''} px-4 py-2 rounded-full`}
                onPress={() => setFilter('Titel')}>
                <Text className={`${filter == 'Titel' ? 'text-white' : 'text-black'} text-lg`}>Titel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${filter == 'Autor' ? 'bg-[#2DA786]' : ''} px-4 py-2 rounded-full`}
                onPress={() => setFilter('Autor')}>
                <Text className={`${filter == 'Autor' ? 'text-white' : 'text-black'} text-lg`}>Autor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${filter == 'Kategorie' ? 'bg-[#2DA786]' : ''} px-4 py-2 rounded-full`}
                onPress={() => setFilter('Kategorie')}>
                <Text className={`${filter == 'Kategorie' ? 'text-white' : 'text-black'} text-lg`}>Kategorie</Text>
              </TouchableOpacity>
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
          const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w400-h600&source=gbs_api`;
          const authors = item.volumeInfo.authors;
          const categories = item.volumeInfo.categories;

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedBook(item);
                  
                router.push({
                  pathname: `/suche/bookpage/${item.id}`
                })
              }}
              className='w-full'>
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
};

export default SearchPage;
