import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookpage = () => {
  const {
    id,
    title,
    authors,
    description,
    pageCount,
    thumbnail,
    subject
  } = useLocalSearchParams();

  console.log(title, description, pageCount);
  

  return (
    <SafeAreaView>
      <Text>{id}</Text>
    </SafeAreaView>
  )
}

export default Bookpage