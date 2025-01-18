import { View, Text, ScrollView, Image, TouchableOpacity, Animated, Dimensions, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';


import Empfehlungen from '@/components/Empfehlungen';
import likeBook from '@/lib/buchMerken';
import editActiveBooks from '@/lib/editActiveBooks';
import useBookStore from '@/stores/zustandBookHandling';
import axios from 'axios';
import getSavedBooks from '@/lib/getSavedBooks';
import getActiveBooks from '@/lib/getActiveBooks';


const { width } = Dimensions.get('window');

const API_KEY = process.env.API_KEY;

const normalizeBookData = (book) => {
  return {
    id: book.googleBooksId || book.id,
    title: book.title || book.volumeInfo?.title,
    authors: book.authors ? (typeof book.authors === 'string' ? book.authors.split(', ') : book.authors) : book.volumeInfo?.authors,
    categories: book.categories ? (typeof book.categories === 'string' ? book.categories.split(', ') : book.categories) : book.volumeInfo?.categories || [],
    description: book.description || book.volumeInfo?.description,
    pageCount: book.pages || book.volumeInfo?.pageCount,
  };
};

const Bookpage = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const selectedBook = useBookStore((state) => state.selectedBook);
  const setShouldRefresh = useBookStore((state) => state.setShouldRefresh);
  const setShouldRefreshLikes = useBookStore((state) => state.setShouldRefreshLikes);
  const removeLastBook = useBookStore((state) => state.removeLastBook);

  const { id } = useLocalSearchParams();

  const bookData = normalizeBookData(selectedBook);
  const { user, updateUser } = useGlobalContext();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);



  const fetchData = async () => {
    try {
      const [likedStatus, activeStatus] = await Promise.all([
        getSavedBooks(user, bookData.id),
        getActiveBooks(user, bookData.id)
      ]);

      setIsLiked(likedStatus);
      setIsActive(activeStatus);
      setIsDataLoaded(true);
    } catch (error) {
      console.error(error);
      setIsDataLoaded(true); // Setzen Sie es auch im Fehlerfall auf true
    }
  };

  const handleBack = () => {
    removeLastBook();
    router.back();
  };

  const handleLikeBook = async () => {
    try {
      setIsLiked(!isLiked);
      await likeBook(user, bookData.id, selectedBook);
      await updateUser(); // Aktualisiere den User
      setShouldRefreshLikes(true);
      setShouldRefresh(true);
    } catch (error) {
      setIsLiked(!isLiked); // Revert on error
      console.error('Error liking book:', error);
    }
  };
  const handleEditActiveBooks = async () => {
    try {
      setIsActive(!isActive);
      await editActiveBooks(user, bookData.id, selectedBook);
      await updateUser()
      setShouldRefreshLikes(true);
      setShouldRefresh(true);
    } catch (error) {
      console.error('Error editing active books:', error);
    }
  };

  const getBooks = async () => {
    try {
      setLoading(true);

      const isValidBook = (book) => {
        const info = book.volumeInfo || book;
        return (
          info.title &&
          info.authors?.length > 0 &&
          info.imageLinks?.thumbnail &&
          info.description &&
          info.pageCount
        );
      };

      const enrichBook = async (book) => {
        try {
          const enrichResponse = await axios.get(
            'https://www.googleapis.com/books/v1/volumes',
            {
              params: {
                q: `intitle:"${book.volumeInfo?.title || book.title}" inauthor:"${book.volumeInfo?.authors?.[0] || book.authors[0]}"`,
                langRestrict: 'de',
                maxResults: 1,
                orderBy: 'relevance',
                key: API_KEY
              }
            }
          );

          if (
            enrichResponse.data?.items?.[0] &&
            isValidBook(enrichResponse.data.items[0])
          ) {
            return enrichResponse.data.items[0];
          }
          return book;
        } catch (error) {
          console.error('Enrichment error:', error);
          return book;
        }
      };

      if (bookData.categories?.[0]) {
        try {
          const resCategory = await axios.get(
            'https://www.googleapis.com/books/v1/volumes',
            {
              params: {
                q: `subject:"${bookData.categories[0]}"`,
                langRestrict: 'de',
                maxResults: 40,
                orderBy: 'relevance',
                key: API_KEY
              }
            }
          );

          if (resCategory.data?.items && resCategory.data.items.length > 0) {
            const validBooks = resCategory.data.items
              .filter(book => book.id !== bookData.id && isValidBook(book))
              .slice(0, 5);

            if (validBooks.length > 0) {
              const enrichedBooks = await Promise.all(
                validBooks.map(book => enrichBook(book))
              );

              setBooks(enrichedBooks);
            }
          }
        } catch (error) {
          console.error('Error fetching category books:', error);
        }
      }

    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
    fetchData()
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} className='flex-1 bg-white'>
      <Animated.View
        className='absolute top-0 left-0 right-0 z-50'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [width * 0.4, width * 0.6, width * 0.7, width * 0.8, width * 0.94 + 60],
            outputRange: [0, 0.1, 0.3, 0.6, 1],
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
              <TouchableOpacity onPress={() => { handleBack() }}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text className='text-lg font-medium'>
                {bookData.title?.length > 25 ? bookData.title.substring(0, 25) + "..." : bookData.title}
              </Text>
              <View className='w-8' />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        className='absolute top-0 left-0 z-50 p-5 pt-3'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [width * 0.4, width * 0.6, width * 0.7, width * 0.8, width * 0.94 + 60],
            outputRange: [1, 0.9, 0.6, 0.3, 0],
            extrapolate: 'clamp',
          }),
        }}
      >
        <SafeAreaView>
          <TouchableOpacity onPress={() => { handleBack() }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerClassName="px-7 pt-40"
      >
        <View>
          <View style={{
            width: width * 0.6,
            height: width * 0.94,
            alignSelf: 'center',
            shadowColor: 'black',
            shadowOffset: { height: 10 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 3,
          }}>
            <Image
              source={{ uri: `https://books.google.com/books/publisher/content/images/frontcover/${bookData.id}?fife=w400-h600&source=gbs_api` }}
              className="w-full h-full"
              resizeMode="stretch"
            />
          </View>

          <Text className="text-xl mt-5 font-bold text-center">
            {bookData.title}
          </Text>

          {bookData.authors?.map((author, idx) => (
            <Text key={idx} className="text-center text-gray-600">
              {author}
            </Text>
          ))}

          <View className="flex-col items-center justify-center mt-3">
            <TouchableOpacity
              onPress={handleLikeBook}
              disabled={!isDataLoaded}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
              }}
              className="flex-row gap-2 bg-black px-4 w-8/12 h-14 items-center justify-center rounded-full mb-3"
            >
              {isDataLoaded ? (
                <>
                  <Text className="text-white font-bold text-lg">zur Leseliste</Text>
                  {isLiked ?
                    <Ionicons name="bookmark" size={24} color="white" /> :
                    <Ionicons name="bookmark-outline" size={24} color="white" />
                  }
                </>
              ) : (
                <ActivityIndicator color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEditActiveBooks}
              disabled={!isDataLoaded}
              style={{
                shadowColor: '#2DA786',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 8,
              }}
              className="flex-row gap-2 bg-[#2DA786] px-4 w-8/12 h-14 items-center justify-center rounded-full"
            >
              {isDataLoaded ? (
                <>
                  <Text className="text-white font-bold text-lg">
                    {isActive ? 'Am Lesen...' : 'Lesen'}
                  </Text>
                  {isActive ?
                    <Feather name="book-open" size={24} color="white" /> :
                    <Feather name="book" size={24} color="white" />
                  }
                </>
              ) : (
                <ActivityIndicator color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-600 text-lg font-semibold mt-2">
            Seiten: {bookData.pageCount}
          </Text>

          <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
            Beschreibung
          </Text>

          <View>
            <Text
              className="text-gray-500 mt-2 text-justify"
              style={{
                opacity: showFullDescription ? 1 : 0.95,
              }}
            >
              {bookData.description && (showFullDescription
                ? bookData.description
                : bookData.description?.substring(0, 500) + "..."
              )}
            </Text>
            {bookData.description && bookData.description.length > 500 && !showFullDescription && (
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.create(
                      400,
                      LayoutAnimation.Types.easeInEaseOut,
                      LayoutAnimation.Properties.opacity
                    )
                  );
                  setShowFullDescription(true);
                }}
                className="mt-2 mb-2"
              >
                <View className="flex items-center justify-center">
                  <Text className="text-[#2DA786] font-bold text-base mt-2">
                    Mehr lesen
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#2DA786"
                    style={{ marginTop: 4 }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {bookData.description && (
              <View className="mb-12" />
            )}
          </View>

          <View className="px-2 mt-3 mb-10">
            <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
              Ähnliche Bücher
            </Text>
            <Empfehlungen
              books={books}
              loading={loading}
              newPage={true}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );

}

export default Bookpage;
