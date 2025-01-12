import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';


import Modal from './modal';


export default function Empfehlungen({ books , openModal, loading}) {



 

  return (
 
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='mt-4' >
          {!loading ? books.map((book, index) => {
            let title = book.volumeInfo.title
            const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w400-h600&source=gbs_api`
            let authors = book.volumeInfo.authors

            return (
              thumbnail != undefined && title != undefined && authors != undefined && (
                <TouchableOpacity key={index} onPress={() => {openModal(index)}}  className='mr-3 flex-1'>
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
          }) : <ActivityIndicator size={'large'} color={'#2DA786'} style={{ marginLeft: 165, marginTop: 10 }} />}

        </ScrollView>
       

  );
}
