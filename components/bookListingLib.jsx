import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import useBookStore from '@/stores/zustandBookHandling';
export default function BookListingLib({book}) {
  const setSelectedBook = useBookStore((state) => state.setSelectedBook);
  
  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '..';
    }
    return text;
  };

  const handlePress = () => {
    setSelectedBook(book);
    router.push({
      pathname: `/bookpage/${book.googleBooksId}`
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex flex-col">
        <View className="drop-shadow-md"
        style={{
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 3,
        }}
        >
          <Image 
            source={{uri: book.image}} 
            resizeMode='stretch' 
            className='w-44 h-72'
          />
        </View>
     
        <Text className="mt-2 text-xl font-bold">
          {truncateText(book.title, 12)}
        </Text>
        <Text className="color-[#8C8C8C]">
          {truncateText(book.authors, 12)}
        </Text>
     
      </View>
    </TouchableOpacity>
  )
}
