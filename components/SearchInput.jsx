import { View, TextInput, Modal, TouchableOpacity, Text, Animated } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { router, useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import Fontisto from '@expo/vector-icons/Fontisto';

const CustomAlert = ({ visible, onClose, message }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          className="bg-white rounded-3xl p-6 m-4 items-center max-w-[300px]"
          style={{
            opacity: fadeAnim,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }],
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4">
            <Fontisto name="warning" size={24} color="#EF4444" />
          </View>
          <Text className="text-center text-base font-medium mb-4">
            {message}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="bg-[#2DA786] py-3 px-8 rounded-xl"
          >
            <Text className="text-white font-medium">OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const SearchInput = ({ oldSearch }) => {

 
  
    const [search, setSearch] = useState(oldSearch || '');
  
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSearch = () => {
    if (!search?.trim()) {
      setAlertVisible(true);
      return;
    }
    console.log(search);
    router.push(`/suche/searchResults/${search}`);
  }

  return (
    <>
      <View
        className="border border-[#2DA786] bg-white mt-6 w-full h-14 px-4 rounded-2xl gap-4 items-center flex-row"
        style={{
          shadowColor: 'rgba(45, 167, 134, 0.4)',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.8,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <Fontisto onPress={handleSearch} name="search" size={18} color="#9E9292" />
        <TextInput
          className="flex-1 text-black font-normal"
          value={search}
          placeholder='Suche...'
          placeholderClassName='flex-1 font-normal'
          placeholderTextColor='#9E9292'
          onChangeText={(text) => setSearch(text)}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message="Bitte gib einen Suchbegriff ein."
      />
    </>
  )
}

export default SearchInput
