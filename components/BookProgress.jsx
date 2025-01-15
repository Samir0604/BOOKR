

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getBookProgress } from '../lib/getBookProgress';
import getActiveBooks from '../lib/getActiveBooks';
import EditProgressModal from './editPorgressModal';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { editBookProgress } from '@/lib/editBookProgress';

export default function BookProgress() {
  const [progress, setProgress] = useState(0); 
  const [activeBook, setActiveBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Lokale Zustände für Eingabewerte
  const [localCurrentPage, setLocalCurrentPage] = useState('');
  const [localTotalPages, setLocalTotalPages] = useState('');

  const radius = 85;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (showModal) {
      // Setze die lokalen Zustände auf die aktuellen Werte, wenn das Modal geöffnet wird
      setLocalCurrentPage(currentPage.toString());
      setLocalTotalPages(totalPages.toString());
    }
  }, [showModal, currentPage, totalPages]);

  async function handleSubmit() {
    // Logge die aktuellen lokalen Eingabewerte
    console.log("Local Current Page:", localCurrentPage);
    console.log("Local Total Pages:", localTotalPages);
  
    // Aktualisieren der globalen Zustände mit den lokalen Eingabewerten
    const newCurrentPage = parseInt(localCurrentPage) || 0;
    const newTotalPages = parseInt(localTotalPages) || 0;
    setCurrentPage(newCurrentPage);
    setTotalPages(newTotalPages);
  
    // Verwende die lokalen Werte direkt in der Bedingung
    try {
      if (!user || !activeBook || newCurrentPage === 0 || newTotalPages === 0) {
        console.log("not able to upgrade because of missing parameter");
        console.log("user: ", user.$id, "active: ", activeBook.$id, "current: ", newCurrentPage, "total: ", newTotalPages);
        return;
      }


      console.log("user: ", user.$id, "active: ", activeBook.$id, "current: ", newCurrentPage, "total: ", newTotalPages);
      const upgradedBook = await editBookProgress(user, activeBook.googleBooksId, newCurrentPage, newTotalPages);
  
      if (upgradedBook) {
        console.log("everything went right ");
      }
  
    } catch (error) {
      console.log("error while editing progress: ", error);
    }
  
    setShowModal(false); // Schließen des Modals nach dem Absenden
  }
  

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  async function fetchData() {
    setIsLoading(true);
    try {
      const activeBook = await getActiveBooks(user);
      if (activeBook) {
        setActiveBook(activeBook);
        const progressDocument = await getBookProgress(user, activeBook.$id);
        if (progressDocument !== undefined) {
          setCurrentPage(progressDocument.currentPage);
          setTotalPages(progressDocument.totalPages);
          const progress = progressDocument.totalPages > 0 ? Math.floor((progressDocument.currentPage / progressDocument.totalPages) * 100) : 0;
          setProgress(progress);
        }
      } else {
        console.log("keine Bücher zurück");
      }
    } catch (error) {
      console.log("Fehler beim Laden der Daten:", error);
    } finally {
      console.log(totalPages);
      console.log(currentPage);
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
            <Text className='text-3xl font-bold'>{truncateText(activeBook.title, 12)}</Text>
            <Text className='text-2xl font-bold text-gray-500'>{truncateText(activeBook.authors, 12)}</Text>
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
            onPress={() => setShowModal(true)}
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
                    <View className='p-6 w-full bg-white/50 flex flex-col'>
                      <Text className='text-3xl font-semibold text-gray-800 mb-8 self-center'>Fortschritt anpassen</Text>

                      <View className='mb-10 flex-col gap-1 '>
                        <Text className='text-2xl text-black font-semibold'>Letzter Fortschritt</Text>
                        <Text className='text-lg font-medium text-gray-800'>09.01.2025<Text className='ml-2 text-lg'>⚡️</Text></Text>
                      </View>

                      <View className='mb-8'>
                        <Text className='text-2xl text-black mb-2 font-semibold'>Aktuelle Seite</Text>
                        <View className='flex flex-row items-center justify-between'>
                          <TextInput 
                            className='bg-[rgba(180,180,180,0.2)] px-4 py-3 rounded-lg w-32 text-xl font-medium'
                            keyboardType='numeric'
                            value={localCurrentPage} // Verwende value statt defaultValue
                            onChangeText={setLocalCurrentPage} // Aktualisierung des lokalen Zustands
                            textAlign='center'
                            style={{
                              textAlignVertical: 'center'
                            }}
                          />

                          <View className='flex flex-row items-end px-4 py-3 rounded-lg justify-end'>
                            <Text className='mr-1.5 text-xl'>von</Text>
                            <TextInput 
                              className='text-xl font-medium text-gray-800 mr-2'
                              keyboardType='numeric'
                              value={localTotalPages} // Verwende value statt defaultValue
                              onChangeText={setLocalTotalPages} // Aktualisierung des lokalen Zustands
                              placeholderTextColor="#6B7280"
                              textAlign='center'
                              style={{
                                color: '#6B7280',
                              }}
                            />
                            <TouchableOpacity>
                              <MaterialIcons name="edit" size={24} color="#666" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity 
                        className='w-full bg-[#2DA786] mt-auto p-4 rounded-lg flex items-center justify-center'
                        onPress={handleSubmit} // Submit-Handler
                      >
                        <Text className='text-white font-semibold text-lg'>Fortschritt aktualisieren</Text>
                      </TouchableOpacity>

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
