import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons'

import SearchInput from '@/components/SearchInput'
import LinearGradientCard from '@/components/LinearGradientCard'
import Empfehlungen from '@/components/Empfehlungen'
import { useModal } from '@/components/useModal'
import Modal from '@/components/modal'

const { width } = Dimensions.get('window')

const GenreButton = ({ title, icon }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-4 border-b border-[#E5E5E5]"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }}
  >
    <Text className="text-xl font-medium text-gray-800">{title}</Text>
    {icon}
  </TouchableOpacity>
)

const SectionTitle = ({ title, subtitle }) => (
  <View className='flex-col gap-2 mb-4'>
    <View className='flex flex-row items-center justify-between'>
      <Text className='text-3xl font-bold'>{title}</Text>
      {title !== "Entdecke Genres" && (
        <MaterialIcons name="navigate-next" size={38} color="#2DA786" />
      )}
    </View>
    {subtitle && (
      <Text className='text-[#8C8C8C] font-medium text-lg' style={{ lineHeight: 22 }}>
        {subtitle}
      </Text>
    )}
  </View>
)

const bibliothek = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const { modalVisible, bookIndex, slideAnim, scaleAnim, openModal, closeModal } = useModal()

  async function getBooks() {
    try {
      setLoading(true)
      const res = await axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:1984+inauthor:George+Orwell&key=AIzaSyCARWlbz3FVwnVoD81zrscOZ4gPZ85jr40&maxResults=5')
      setBooks(res.data.items)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBooks()
  }, [])

  return (
    <>
      <ScrollView className='bg-white flex-1'>
        <SafeAreaView className='bg-white flex-1 p-5'>
          <View className="flex-1">
            {/* Header Section */}
            <View className='mt-12 mb-6'>
              <Text className='text-4xl font-bold mb-4'>Suche</Text>
              <SearchInput />
            </View>

            {/* AI Assistant Card */}
            <View className='mb-8'>
              <LinearGradientCard 
                headline='Dein AI Assistent' 
                desc='Unser AI-Assistent hilft dir, dein nächstes Lieblingsbuch schnell und einfach zu finden!' 
                btnText='Starte Jetzt' 
                ai={true} 
              />
            </View>

            {/* Recommendations Section */}
            <View className='mb-8'>
              <SectionTitle 
                title="Persönlichkeitsentwicklung"
                subtitle="Unsere Auswahl passend zu deinem zuletzt gewählten Genre"
              />
              <Empfehlungen 
                books={books} 
                loading={loading} 
                openModal={openModal} 
              />
            </View>

            {/* Genres Section */}
            <View className='mb-8'>
              <SectionTitle title="Entdecke Genres" />
              
              <View className="bg-white rounded-2xl p-4 mt-2"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <GenreButton
                  title="Krimi"
                  icon={<MaterialIcons name="search" size={24} color="#000000" />}
                />
                <GenreButton
                  title="Persönlichkeitsentwicklung"
                  icon={<FontAwesome5 name="seedling" size={20} color="#77DD77" />}
                />
                <GenreButton
                  title="Liebesromane"
                  icon={<FontAwesome5 name="heart" size={20} color="#FF6B6B" />}
                />
                <GenreButton
                  title="Spiritualität"
                  icon={<FontAwesome5 name="dove" size={20} color="#A8A8A8" />}
                />
                <GenreButton
                  title="Poesie"
                  icon={<Feather name="edit-3" size={22} color="#000000" />}
                />
                <GenreButton
                  title="Fantasy"
                  icon={<FontAwesome5 name="dragon" size={20} color="#90EE90" />}
                />
                <GenreButton
                  title="Geschichte"
                  icon={<FontAwesome5 name="book" size={20} color="#4A9C5E" />}
                />
                <TouchableOpacity
                  className="flex-row items-center justify-between py-4"
                >
                  <Text className="text-xl font-medium text-gray-800">Alle Genres</Text>
                  <MaterialIcons name="chevron-right" size={28} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      
      {modalVisible && (
        <Modal 
          books={books} 
          closeModal={closeModal} 
          width={width} 
          slideAnim={slideAnim} 
          scaleAnim={scaleAnim} 
          bookIndex={bookIndex} 
          first={true} 
        />
      )}
    </>
  )
}

export default bibliothek
