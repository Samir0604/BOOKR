import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';



export default function Empfehlungen() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  async function getBooks() {
    try {
      setLoading(true)
      const res = await axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:1984+inauthor:George+Orwell&key=AIzaSyCARWlbz3FVwnVoD81zrscOZ4gPZ85jr40&maxResults=5')
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



  return (
    <LinearGradient
      colors={["rgba(107, 180, 160, 0.33)", "rgba(255, 255, 255, 0.44)"]}
      locations={[0.23, 0.77]}
      style={{
        borderRadius: 25,
        marginTop: 32,
      }}
    >

      {/* oberster Container */}
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
          >Für dich zusammengestellt: Lass dich von unserer Auswahl inspirieren</Text>

        </View>


        {/* Bilder mit Titel rendern */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='mt-4' >
          {!loading ? books.map((book, index) => {
            let title = book.volumeInfo.title
            const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w400-h600&source=gbs_api`
            let authors = book.volumeInfo.authors

            return (
              thumbnail != undefined && title != undefined && authors != undefined && (
                <TouchableOpacity key={index} className='mr-3 flex-1'>
                  <View className='w-44 h-72 drop-shadow-md mb-2 z-50' style={{
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                    elevation: 3,
                  }}>
                    <Image source={{ uri: thumbnail }} className='w-full h-full' resizeMode='stretch' />
                  </View>
                  <Text className="font-bold text-lg overflow-hidden">
                    {title.length > 17 ? `${title.substring(0, 17)}..` : title}
                  </Text>

                  {
                    authors.length === 1 ? (
                      <Text className="color-[#8C8C8C]">{authors[0]}</Text>
                    ) : authors.length === 2 ? (
                      authors.map((author, index) => (
                        <Text key={index} className="color-[#8C8C8C]">{author}</Text>
                      ))
                    ) : (
                      authors.slice(0, 2).map((author, index) => (
                        <Text key={index} className="color-[#8C8C8C]">{author}</Text>
                      ))
                    )
                  }
                </TouchableOpacity>)
            )
          }) : <ActivityIndicator size={'large'} color={'#2DA786'} style={{marginLeft: 165, marginTop: 10}} />}

        </ScrollView>

      </View>

    </LinearGradient>
  );
}
