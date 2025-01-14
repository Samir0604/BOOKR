import { View, Text, Image } from 'react-native'
import React from 'react'

export default function BookListingLib({book}) {
  
  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '..';
    }
    return text;
  };


  return (
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
        <Image source={{uri: book.image}} className='w-44 h-72'/>
      </View>
   
      <Text className="mt-2 text-xl font-bold">
        {truncateText(book.title, 12)}
      </Text>
      <Text className="color-[#8C8C8C]">
        {truncateText(book.authors, 12)}
      </Text>
   
    </View>
  )
}
