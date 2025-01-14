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
      
      const bookPromises = categories.map(category =>
        axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: `subject:${category}`,
            maxResults: 40,
            orderBy: 'relevance',
          }
        })
      );
  
      const responses = await Promise.all(bookPromises);
      
      responses.forEach(res => {
        if (res.data.items && res.data.items.length > 0) {
          const shuffledBooks = [...res.data.items]
            .sort(() => Math.random() - 0.5);
          const randomTwoBooks = shuffledBooks.slice(0, 2);
          allBooks = [...allBooks, ...randomTwoBooks];
        }
      });
  
      // Speichern der neuen Bücher und des Zeitstempels
      await AsyncStorage.setItem('weeklyBooks', JSON.stringify(allBooks));
      await AsyncStorage.setItem('lastBooksUpdate', new Date().toISOString());
  
      setBooks(allBooks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  // Im useEffect
  useEffect(() => {
    getBooks();
  }, []);



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