import { View, TextInput } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { usePathname } from 'expo-router'

import Fontisto from '@expo/vector-icons/Fontisto';

const SearchInput = () => {
  const pathName = usePathname();
  const [query, setQuery] = useState('')

  return (
    <View
      className="border border-[#2DA786] bg-white mt-6 w-full h-14 px-4 rounded-2xl gap-4 items-center flex-row"
      style={{
        shadowColor: 'rgba(45, 167, 134, 0.4)', // Using the green color (#2DA786) with opacity
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <Fontisto name="search" size={18} color="#9E9292" />
      <TextInput
        className="flex-1 text-black font-normal"
        value={query}
        placeholder='Suche...'
        placeholderClassName='flex-1 font-normal'
        placeholderTextColor='#9E9292'
        onChangeText={(e) => setQuery(e)}
      />
    </View>



  )
}

export default SearchInput









  