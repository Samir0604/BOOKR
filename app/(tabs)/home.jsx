import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { account } from '@/lib/appwrite';


import axios from 'axios';
import useBookStore from '@/stores/zustandBookHandling';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ZurSammlung from '@/components/ZurSammlung';
import Empfehlungen from '@/components/Empfehlungen';
import { useGlobalContext } from '@/context/GlobalProvider';
import Modal from '@/components/modal';
import { useModal } from '@/components/useModal';



const { width } = Dimensions.get('window');

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const home = () => {
  const { user } = useGlobalContext();




  const refreshHomeLikes = useBookStore((state) => state.refreshHomeLikes);
  const setRefreshHomeLikes = useBookStore((state) => state.setRefreshHomeLikes);
  const refreshHomeActives = useBookStore((state) => state.refreshHomeActives);
  const setRefreshHomeActives = useBookStore((state) => state.setRefreshHomeActives);


  const [likes, setLikes] = useState([]);
  const [actives, setActives] = useState([]);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRandomCategories = () => {
    let tempArray = [...user.liked_categories];

    let result = [];

    if (tempArray.length === 0) {
      return 'No categories available';
    }

    const numberOfCategories = Math.min(3, tempArray.length);

    for (let i = 0; i < numberOfCategories; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      result.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }

    return result;
  }

  const shouldUpdateBooks = async () => {
    try {
      const lastUpdate = await AsyncStorage.getItem('lastBooksUpdate');
      const session = await account.getSession('current');

      if (!session || !lastUpdate) return true;

      const lastUpdateDate = new Date(lastUpdate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - lastUpdateDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const sessionStartTime = new Date(session.$createdAt);
      const hasNewSession = sessionStartTime > lastUpdateDate;

      return diffDays >= 7 || hasNewSession;
    } catch (error) {
      console.error('Error checking update time:', error);
      return true;
    }
  };
  const resetAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      // Bücher neu laden
      await getBooks();
      console.log('All storage successfully reset');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  async function getBooks() {
    try {
      setLoading(true);
  
      try {
        await account.getSession('current');
      } catch (error) {
        console.log('No active session');
        setLoading(false);
        return;
      }
  
      const shouldUpdate = await shouldUpdateBooks();
      if (!shouldUpdate) {
        const storedBooks = await AsyncStorage.getItem('weeklyBooks');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
          setLoading(false);
          return;
        }
      }
  
      const isValidBook = (book) => {
        return (
          book.volumeInfo?.title &&
          book.volumeInfo?.authors?.length > 0 &&
          book.volumeInfo?.imageLinks?.thumbnail &&
          book.volumeInfo?.description &&
          book.volumeInfo?.pageCount
        );
      };
  
      const enrichBook = async (book, language = 'de') => {
        try {
          const enrichResponse = await axios.get(
            'https://www.googleapis.com/books/v1/volumes',
            {
              params: {
                q: `intitle:"${book.volumeInfo.title}" inauthor:"${book.volumeInfo.authors[0]}"`,
                langRestrict: language,
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
  
      let allBooks = [];
      const categories = getRandomCategories();
      const REQUIRED_BOOKS = 6;
  
      if (categories === 'No categories available') {
        setLoading(false);
        return;
      }
  
      const getBooksPerCategory = (categoryCount) => {
        switch (categoryCount) {
          case 1:
            return [6];
          case 2:
            return [3, 3];
          default:
            return Array(categoryCount).fill(2);
        }
      };
  
      let booksPerCategory = getBooksPerCategory(categories.length);
      let categoryIndex = 0;
  
      // Weitermachen bis wir 6 Bücher haben
      while (allBooks.length < REQUIRED_BOOKS && categoryIndex < categories.length) {
        const category = categories[categoryIndex];
        const targetBooksForCategory = booksPerCategory[categoryIndex];
        let validBooksFound = 0;
        let attempts = 0;
        const maxAttempts = 5; // Erhöht von 3 auf 5
  
        while (validBooksFound < targetBooksForCategory && attempts < maxAttempts && allBooks.length < REQUIRED_BOOKS) {
          try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
              params: {
                q: `subject:${category}`,
                maxResults: 10, // Erhöht für mehr Optionen
                orderBy: 'relevance',
                langRestrict: 'de',
                key: API_KEY
              }
            });
  
            if (response.data.items && response.data.items.length > 0) {
              const validBooks = response.data.items
                .filter(isValidBook)
                .sort(() => Math.random() - 0.5);
  
              for (const book of validBooks) {
                if (validBooksFound >= targetBooksForCategory) break;
  
                const enrichedBook = await enrichBook(book);
                if (isValidBook(enrichedBook)) {
                  const isDuplicate = allBooks.some(
                    existingBook => existingBook.id === enrichedBook.id
                  );
  
                  if (!isDuplicate) {
                    allBooks.push({
                      ...enrichedBook,
                      subject: category
                    });
                    validBooksFound++;
                  }
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching books for category ${category}:`, error);
          }
          attempts++;
        }
  
        // Wenn wir nicht genug Bücher für diese Kategorie gefunden haben,
        // verteilen wir die restlichen auf die anderen Kategorien
        if (allBooks.length < REQUIRED_BOOKS && categoryIndex === categories.length - 1) {
          categoryIndex = 0; // Zurück zur ersten Kategorie
          // Neue Verteilung der restlichen benötigten Bücher
          const remainingBooks = REQUIRED_BOOKS - allBooks.length;
          booksPerCategory = categories.map(() => Math.ceil(remainingBooks / categories.length));
        } else {
          categoryIndex++;
        }
      }
  
      // Wenn wir zu viele Bücher haben, schneiden wir sie ab
      allBooks = allBooks.slice(0, REQUIRED_BOOKS);
  
      if (allBooks.length === REQUIRED_BOOKS) {
        await AsyncStorage.setItem('weeklyBooks', JSON.stringify(allBooks));
        await AsyncStorage.setItem('lastBooksUpdate', new Date().toISOString());
        setBooks(allBooks);
      } else {
        console.log('Could not find enough books');
      }
  
    } catch (error) {
      console.error('Error in getBooks:', error);
    } finally {
      setLoading(false);
    }
  }
  
  

  const getLiked = async () => {
    try {
      const savedBooks = user.savedBooks.map(book => book.googleBooksId);

      setLikes(savedBooks);
    } catch (error) {
      console.error('Error getting liked books:', error);
    }
  };

  const getActive = async () => {
    try {
      const activeBooks = user.activeBooks.map(book => book.googleBooksId);

      setActives(activeBooks);
    } catch (error) {
      console.error('Error getting liked books:', error);
    }
  };


  const {
    modalVisible,
    bookIndex,
    slideAnim,
    scaleAnim,
    openModal,
    closeModal
  } = useModal();


  // Refresh handling likes
  useEffect(() => {
    if (refreshHomeLikes) {
      getLiked();

      setRefreshHomeLikes(false);
    }
  }, [refreshHomeLikes]);

  // Refresh handling actives
  useEffect(() => {
    if (refreshHomeActives) {

      getActive()

      setRefreshHomeActives(false);
    }
  }, [refreshHomeActives]);

  // Initial load
  useEffect(() => {

    getBooks();
    getActive()
    getLiked();
 


  }, [user]);


  return (
    <>
      <ScrollView className='bg-white flex-1'>
        <SafeAreaView className='bg-white flex-1 p-5'>
          <View className="mt-12">

            <View className='flex flex-row items-center border-b border-[#8C8C8C] '>
              <Text className='text-4xl font-bold'>Aktive Bücher</Text>
              <MaterialIcons
                name="navigate-next"
                size={34}
                color="#2DA786"
              />
            </View>

            <BookProgress />
            <ZurSammlung />

            {/* Empfehlungen */}
            <LinearGradient
              colors={["rgba(107, 180, 160, 0.33)", "rgba(255, 255, 255, 0.44)"]}
              locations={[0.23, 0.77]}
              style={{
                borderRadius: 25,
                marginTop: 32,
              }}
            >
              <View className='p-4'>
                <View className='flex-col gap-2'>
                  <View className='flex flex-row items-center'>
                    <Text className='text-3xl font-bold'>Empfehlungen für dich </Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={38}
                      color="#2DA786"
                    />
                  </View>

                  <View>
                    <Text
                      className='color-[#8C8C8C] font-medium text-lg'
                      style={{ lineHeight: 22 }}
                    >
                      Für dich zusammengestellt: Lass dich von unserer Auswahl inspirieren
                    </Text>
                  </View>
                </View>

                <Empfehlungen
                  books={books}
                  loading={loading}
                  openModal={openModal}
                />
              </View>
            </LinearGradient>
            {/* <TouchableOpacity onPress={() => likeBook(user, 'hahahoho')}><Text>Hi</Text></TouchableOpacity> */}
          </View>
        </SafeAreaView>
      </ScrollView >
      {/* Ausserhalb aller sachen da es sonst nicht mit dem padding der safeareaview klappt */}
      {modalVisible ? (
        <Modal
          books={books}
          closeModal={closeModal}
          likes={likes}
          setLikes={setLikes}
          actives={actives}
          setActives={setActives}
          width={width}
          slideAnim={slideAnim}
          scaleAnim={scaleAnim}
          bookIndex={bookIndex}
          first={true}
        />
      ) : null}
      {/* books um das jeweilige book am index der flatlist zu displayen, restlichen daten für css code, der bookindex für den  initialScrollIndex={bookIndex} damit die flatlist weiss zu welchem buch sie springen muss wenn ich eins anklicke  */}
    </>
  )
}

export default home