import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Modal = ({ books, closeModal, width, slideAnim, bookIndex }) => {


  // Calculate the snap interval considering margin
  const itemWidth = width * 0.92;
  const itemMargin = width * 0.02; // 2% of the screen width for margin
  const snapInterval = itemWidth + itemMargin;


  return (
    <>

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
          data={books}
          horizontal
          contentContainerStyle={{ paddingHorizontal: width * 0.04 }} // Adjust initial padding
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          snapToInterval={snapInterval} // Use dynamic snap interval with margin
          decelerationRate="fast"
          getItemLayout={(data, index) => (
            {length: itemWidth, offset: (itemWidth + itemMargin) * index, index}
          )}
          initialScrollIndex={bookIndex}
          renderItem={({ item, index }) => {

            let title = item.volumeInfo.title
            const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w400-h600&source=gbs_api`
            let authors = item.volumeInfo.authors
            const description = item.volumeInfo.description

            return (
              <View
                className={`bg-white rounded-t-2xl mt-20 p-5 pb-0`}
                style={{
                  width: itemWidth,
                  marginLeft: index === 0 ? 0 : itemMargin / 2, // Adjust margin for first item
                  marginRight: index === 5 ? 0 : itemMargin / 2, // Adjust margin for last item
                }}
              >
                <TouchableOpacity onPress={closeModal} style={{ alignSelf: 'flex-end' }}>
                  <Text className="text-gray-600 text-lg">X</Text>
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image
                    source={{ uri: thumbnail }}
                    style={{ width: width * 0.6, height: width * 0.9, alignSelf: 'center' }}
                    resizeMode="stretch"
                  />
                  <Text className="text-xl mt-5 font-bold text-center">{title}</Text>
                  {authors.map((author, index) => (<Text className="text-center text-gray-600">{author}</Text>))}

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
                  <Text className="text-gray-500 mt-2 mb-12 text-center">
                  {description}
                  </Text>
                </ScrollView>
              </View>
            );
          }}
        />
      </Animated.View>


    </>
  )
}

export default Modal