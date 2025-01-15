import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getBookProgress } from '../lib/getBookProgress';
import getActiveBooks from '../lib/getActiveBooks';
import EditProgressModal from './editPorgressModal';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'


export default function BookProgress() {
  const [progress, setProgress] = useState(0); 
  const [activeBook, setActiveBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const { user } = useGlobalContext();

  const radius = 85;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  async function fetchData() {
    try {
      // Erst activeBooks laden
      const activeBook = await getActiveBooks(user);
      if(activeBook) {
        setActiveBook(activeBook);
        // Dann erst den Progress laden
        const savedProgress = await getBookProgress(user, activeBook.$id);
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
              setShowModal(true)
            }}
          >
            <Text className='text-white font-bold text-lg'>Fortschritt anpassen</Text>
          </TouchableOpacity>



<EditProgressModal isOpen={showModal}>
  <TouchableOpacity 
    activeOpacity={1}
    onPress={() => setShowModal(false)}
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
    }}
  >
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%'
      }}
    >
      <TouchableOpacity 
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        <BlurView intensity={50} tint="light" className="overflow-hidden rounded-lg w-full">
          <View className='p-6 w-full bg-white/50  flex flex-col'>
            <Text className='text-3xl font-semibold text-gray-800 mb-8 self-center'>Fortschritt anpassen</Text>

            { /* Letzter Fortschritt - Vertikal */}
            <View className='mb-10 flex-col gap-1 '>
              <Text className='text-2xl text-black font-semibold'>Letzter Fortschritt</Text>
              <Text className='text-lg font-medium text-gray-800'>09.01.2025<Text className='ml-2 text-lg'>⚡️</Text></Text>
            </View>

            {/* Seitenzahl Eingabe - Vertikal */}
            <View className='mb-8'>
              <Text className='text-2xl text-black mb-2 font-semibold'>Aktuelle Seite</Text>
              <View className='flex flex-row items-center justify-between'>
                <TextInput 
                  className='bg-[rgba(180,180,180,0.2)] px-4 py-3 rounded-lg w-32 text-xl font-medium'
                  keyboardType='numeric'
                  placeholder='123'
                  textAlign='center'
                  style={{
                    textAlignVertical: 'center'
                  }}
                />
            
                <View className='flex flex-row items-center bg-[rgba(180,180,180,0.2)] px-4 py-3 rounded-lg'>
                  <Text className='text-lg text-gray-600 mr-2'>von</Text>
                  <Text className='text-xl font-medium text-gray-800 mr-2'>203</Text>
                  <TouchableOpacity>
                    <MaterialIcons name="edit" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Update Button */}
            <TouchableOpacity 
              className='w-full bg-[#2DA786] mt-auto p-4 rounded-lg flex items-center justify-center'
              onPress={() => setShowModal(false)}
            >
              <Text className='text-white font-semibold text-lg'>Fortschritt aktualisieren</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              className='absolute top-4 right-4'
              onPress={() => setShowModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </TouchableOpacity>
</EditProgressModal>




        </View>
      </View>
    </LinearGradient>
  );
}
