import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { account } from '@/lib/appwrite';


import axios from 'axios';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ZurSammlung from '@/components/ZurSammlung';
import Empfehlungen from '@/components/Empfehlungen';
import { useGlobalContext } from '@/context/GlobalProvider';
import Modal from '@/components/modal';
import { useModal } from '@/components/useModal';



const { width } = Dimensions.get('window');

const home = () => {

  const { user } = useGlobalContext()

  function getRandomCategories() {
    let tempArray = [...user.liked_categories];
    let result = [];

    if (tempArray.length === 0) {
      return 'No categories available';
    }

    // Bestimme die Anzahl der zu wählenden Kategorien (maximal 3)
    const numberOfCategories = Math.min(3, tempArray.length);

    for (let i = 0; i < numberOfCategories; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      result.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }

    return result;
  }




  /* Books */


  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  const shouldUpdateBooks = async () => {
    try {
      const lastUpdate = await AsyncStorage.getItem('lastBooksUpdate');
      
      // Prüfe ob eine aktive Session existiert
      const session = await account.getSession('current');
      
      // Wenn keine Session existiert oder kein letztes Update, dann Update erforderlich
      if (!session || !lastUpdate) return true;
  
      const lastUpdateDate = new Date(lastUpdate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - lastUpdateDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      // Prüfe ob die Session nach dem letzten Update gestartet wurde
      const sessionStartTime = new Date(session.$createdAt);
      const hasNewSession = sessionStartTime > lastUpdateDate;
  
      // Update wenn 7 Tage vergangen sind ODER eine neue Session existiert
      return diffDays >= 7 || hasNewSession;
    } catch (error) {
      console.error('Error checking update time:', error);
      return true;
    }
  };
  
  // Modifizierte getBooks Funktion
  async function getBooks() {
    try {
      setLoading(true);
  
      // Prüfe ob eine aktive Session existiert
      try {
        await account.getSession('current');
      } catch (error) {
        console.log('No active session');
        setLoading(false);
        return;
      }
  
      // Prüfen ob gespeicherte Bücher existieren und noch aktuell sind
      const shouldUpdate = await shouldUpdateBooks();
      if (!shouldUpdate) {
        const storedBooks = await AsyncStorage.getItem('weeklyBooks');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
          setLoading(false);
          return;
        }
      }
  
      let allBooks = [];
      const categories = getRandomCategories();
      
      // Hilfsfunktion zur Validierung eines Buches
      const isValidBook = (book) => {
        return (
          book.volumeInfo?.title &&
          book.volumeInfo?.authors?.length > 0 &&
          book.volumeInfo?.imageLinks?.thumbnail &&
          book.volumeInfo?.description &&
          book.volumeInfo?.pageCount
        );
      };
  
      // Hilfsfunktion zum Enrichment eines Buches
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
  
      // Für jede Kategorie Bücher abrufen
      for (const category of categories) {
        let validBooksFound = 0;
        let attempts = 0;
        const maxAttempts = 3; // Maximale Anzahl von Versuchen pro Kategorie
        
        while (validBooksFound < 2 && attempts < maxAttempts) {
          try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
              params: {
                q: `subject:${category}`,
                maxResults: 40,
                orderBy: 'relevance',
                langRestrict: 'de',
              }
            });
  
            if (response.data.items && response.data.items.length > 0) {
              // Filtere valide Bücher
              const validBooks = response.data.items
                .filter(isValidBook)
                .sort(() => Math.random() - 0.5);
  
              // Nehme die ersten 2 validen Bücher
              for (const book of validBooks) {
                if (validBooksFound < 2) {
                  // Enrichment für jedes valide Buch
                  const enrichedBook = await enrichBook(book);
                  if (isValidBook(enrichedBook)) {
                    allBooks.push({
                      ...enrichedBook,
                      subject: category
                    });
                    validBooksFound++;
                  }
                } else {
                  break;
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching books for category ${category}:`, error);
          }
          attempts++;
        }
      }
  
      // Wenn wir genug Bücher haben, speichern und setzen
      if (allBooks.length > 0) {
        await AsyncStorage.setItem('weeklyBooks', JSON.stringify(allBooks));
        await AsyncStorage.setItem('lastBooksUpdate', new Date().toISOString());
        setBooks(allBooks);
      }
  
    } catch (error) {
      console.error('Error in getBooks:', error);
    } finally {
      setLoading(false);
    }
  }

  
  // Im useEffect

  useEffect(() => {
    getBooks();
    
  }, [])


  /* Modal */

  const {
    modalVisible,
    bookIndex,
    slideAnim,
    scaleAnim,
    openModal,
    closeModal
  } = useModal();

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
      {modalVisible ? <Modal books={books} closeModal={closeModal} width={width} slideAnim={slideAnim} scaleAnim={scaleAnim} bookIndex={bookIndex} first={true} /> : null}
      {/* books um das jeweilige book am index der flatlist zu displayen, restlichen daten für css code, der bookindex für den  initialScrollIndex={bookIndex} damit die flatlist weiss zu welchem buch sie springen muss wenn ich eins anklicke  */}
    </>
  )
}

export default home