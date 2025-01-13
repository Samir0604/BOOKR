// components/Empfehlungen.jsx
import React from 'react';
import { ScrollView, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';

export default function Empfehlungen({ books, openModal, loading, inModal = false }) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='mt-4'>
      {!loading ? books.map((book, index) => {
        const title = book.volumeInfo.title;
        const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w400-h600&source=gbs_api`;
        const authors = book.volumeInfo.authors;

        return (
          (thumbnail && title && authors) ? (
            <TouchableOpacity
              key={index}
              onPress={() => openModal(index)}
              className='mr-3 flex-1'
            >
              <View className='w-44 h-72 drop-shadow-md mb-2 z-50'
                style={{
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: thumbnail }}
                  className='w-full h-full'
                  resizeMode='stretch'
                />
              </View>
              <Text className="font-bold text-lg overflow-hidden">
                {inModal ? title.length > 12 ? `${title.substring(0, 12)}..` : title : title.length > 17 ? `${title.substring(0, 17)}..` : title}
              </Text>
              {authors.slice(0, 2).map((author, idx) => (
                <Text key={idx} className="color-[#8C8C8C]">{inModal ? author.length > 12 ? `${author.substring(0, 12)}..` : author : author}</Text>
              ))}
            </TouchableOpacity>
          ) : null
        );
      }) : (
        <ActivityIndicator
          size={'large'}
          color={'#2DA786'}
          style={{ marginLeft: 165, marginTop: 10 }}
        />
      )}
    </ScrollView>
  );
}
