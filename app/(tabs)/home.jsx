import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BookProgress from '@/components/BookProgress'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';


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


  /* Books */


  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
 async function getBooks() {
  try {
    setLoading(true)
    const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: 'subject:"Dystopian"',
        maxResults: 40,
        orderBy: 'relevance',
      }
    })
    setBooks(res.data.items)
    setLoading(false)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}


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

                {/* Container für Überschrift und Text */}
                <View className='flex-col gap-2'>

                  <View className='flex flex-row items-center'>
                    <Text className='text-3xl font-bold'>Empfehlungen für dich </Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={38}
                      color="#2DA786"
                    />
                  </View>

                  <Text
                    className='color-[#8C8C8C] font-medium text-lg'
                    style={{ lineHeight: 22 }}
                  >Für dich zusammengestellt: Lass dich von unserer Auswahl inspirieren
                  </Text>

                </View>

                <Empfehlungen books={books} loading={loading} openModal={openModal} /> {/* books wird gepassed um diese zu displayen, loading für den loading state, und openModal weil in empfehlungen der onpress ist um was modal zu öffnen */}


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