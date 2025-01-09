import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import BuchBeispiel from '@/assets/images/BuchBeispiel.png';


export default function Empfehlungen() {

    const books = [
        { title: 'Lichtenstein', author: 'Simon Karper', image: BuchBeispiel },
        { title: '1984', author: 'George Orwell', image: BuchBeispiel },
        { title: '1984', author: 'George Orwell', image: BuchBeispiel },
        { title: '1984', author: 'George Orwell', image: BuchBeispiel },
        { title: '1984', author: 'George Orwell', image: BuchBeispiel },
        { title: '1984', author: 'George Orwell', image: BuchBeispiel },
        // Add more books as needed
      ];




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
             <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='mt-4'>
                {books.map((book, index) => (
                <View key={index} className='mr-3'>
                    <Image source={book.image} className='w-44 h-72 drop-shadow-md' />
                    <Text className='font-bold text-lg'>{book.title}</Text>
                    <Text className='color-[#8C8C8C]'>{book.author}</Text>
                </View>
          ))}
             </ScrollView>

        </View>
    
    </LinearGradient>
  );
}
