import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getBookProgress } from '../lib/getBookProgress';
import { editBookProgress } from '../lib/editBookProgress';
import getActiveBooks from '../lib/getActiveBooks';

export default function BookProgress() {
  const [progress, setProgress] = useState(0); 
  const [activeBook, setActiveBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGlobalContext();

  const radius = 85;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  async function fetchData() {
    try {
      // Erst activeBooks laden
      const activeBooks = await getActiveBooks(user);
      if(activeBooks) {
        setActiveBook(activeBooks);
        // Dann erst den Progress laden
        const savedProgress = await getBookProgress(user, activeBooks.googleBooksId);
        if (savedProgress !== undefined) {
          setProgress(savedProgress);
        }
      } else {
        console.log("keine Bücher zurück");
      }
    } catch(error) {
      console.log("Fehler beim Laden der Daten:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <View>
        <Text>Laden...</Text>
      </View>
    );
  }

  if (!activeBook) {
    return (
      <View>
        <Text>Kein aktives Buch gefunden</Text>
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={["rgba(255, 255, 255, 0.44)", "rgba(107, 180, 160, 0.33)"]}
      locations={[0.23, 0.77]}
      style={{
        borderRadius: 25,
        marginTop: 20,
      }}
    >
      <View className='flex flex-row p-3 items-center justify-between'>
        <Image source={{uri: activeBook.image}} className='w-44 h-72'/>
        
        <View className='flex flex-col items-center w-auto'>
          <View className='flex flex-col justify-center gap-0'>
            <Text className='text-3xl font-bold'>{activeBook.title}</Text>
            <Text className='text-2xl font-bold text-gray-500'>{activeBook.authors}</Text>
          </View>

          <View className="mt-2.5 flex items-center justify-center">
            <Svg width={radius * 2 + strokeWidth} height={radius + strokeWidth}>
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="#D3D3D3"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={0}
                transform={`rotate(180 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
              />
              {progress > 0 && (
                <Circle
                  cx={radius + strokeWidth / 2}
                  cy={radius + strokeWidth / 2}
                  r={radius}
                  stroke="#6BB4A0"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(180 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
                />
              )}
            </Svg>

            <View className='absolute top-0 bottom-0 flex flex-col items-center justify-center mt-10'>
              <Text className='text-4xl font-bold'>{progress}%</Text>
              <Text className='text-2xl font-semibold'>Fortschritt</Text>
            </View>
          </View>

          <TouchableOpacity 
            className='bg-black items-center justify-center p-3 rounded-full mt-10 mx-2'
            onPress={async () => {
              await editBookProgress(user, activeBook.googleBooksId, 49);
              fetchData(); // Daten nach Update neu laden
            }}
          >
            <Text className='text-white font-bold text-lg'>Fortschritt anpassen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
