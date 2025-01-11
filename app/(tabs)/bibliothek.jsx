import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const Bibliothek = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  function handleScroll() {

  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-2xl mb-5">Bibliothek</Text>

      <TouchableOpacity className="bg-blue-700 p-3 rounded" onPress={openModal}>
        <Text className="text-white text-lg">Open Modal</Text>
      </TouchableOpacity>

      {modalVisible && (
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',

          }}
        >
          <FlatList
            data={[1, 2, 3, 5, 6]}
            horizontal
            contentContainerClassName='flex flex-row justify-around '
            contentContainerStyle={{ width: width * 5 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            renderItem={(item) => {
              return (
                <View className={`bg-white rounded-t-2xl mt-20 p-5 ${item.item == 1 ? '-mr-10' : 'ml-10'} `} style={{ width: width - width * 0.08 }}>
                  <TouchableOpacity onPress={closeModal} style={{ alignSelf: 'flex-end' }}>
                    <Text className="text-gray-600 text-lg">X</Text>
                  </TouchableOpacity>
                  <ScrollView>
                    <Image
                      source={require('@/assets/images/BuchBeispiel.png')} // Beispiel-URL für das Buchcover
                      style={{ width: width * 0.6, height: width * 0.9, alignSelf: 'center' }}
                      resizeMode="contain"
                    />
                    <Text className="text-xl mt-5 font-bold text-center">Lichtenstein</Text>
                    <Text className="text-center text-gray-600">Marlene Averbeck</Text>
                    <View className="flex-row justify-center mt-3">
                      <TouchableOpacity className="bg-black py-2 px-4 rounded-full mr-2">
                        <Text className="text-white">zur Leseliste</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-green-600 py-2 px-4 rounded-full">
                        <Text className="text-white">Lesen</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="mt-5 text-center text-gray-500">Psychologie 📚 | Geografie 🌍 | Wissen 💡</Text>
                    <Text className="mt-5 text-gray-700 text-center">Beschreibung</Text>
                    <Text className="text-gray-500 mt-2 text-justify">
                      Ich war eines Tages zuhause als die Türe klingelte und ein Haufen Syrer uns vergewaltigten...
                    </Text>
                  </ScrollView>
                </View>

              )
            }}
          />

        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Bibliothek;
