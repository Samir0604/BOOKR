import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, FlatList, ScrollView, Dimensions } from 'react-native';

import axios from 'axios';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';


import Empfehlungen from './Empfehlungen';

import { useModal } from './useModal';

const Modal = ({ books, closeModal, width, slideAnim, scaleAnim, bookIndex, first = false }) => {



  /* Books */


  const [booksInModal, setBooksInModal] = useState([])
  const [loadingInModal, setLoadingInModal] = useState(false)
  async function getBooks() {
    try {
      setLoadingInModal(true)
      const res = await axios.get('https://www.googleapis.com/books/v1/volumes?q=seo&key=AIzaSyCARWlbz3FVwnVoD81zrscOZ4gPZ85jr40&maxResults=5')
      setBooksInModal(res.data.items)
      setLoadingInModal(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingInModal(false)
    }

  }

  useEffect(() => {
    getBooks();
  }, [])


  /* Modal */

  const { 
    modalVisible: innerModalVisible,
    bookIndex: innerBookIndex,
    slideAnim: innerSlideAnim,
    scaleAnim: innerScaleAnim,
    openModal: openInnerModal,
    closeModal: closeInnerModal
  } = useModal();




  // Calculate the snap interval considering margin
  const itemWidth = width * 0.92;
  const itemMargin = width * 0.02; // 2% of the screen width for margin
  const snapInterval = itemWidth + itemMargin;


  return (
    <>

      <Animated.View
        style={{
          transform: [
            { translateY: slideAnim }, // Use translateY for vertical movement
            { scale: scaleAnim }       // Scale for zoom effect
          ],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: first ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'
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
            { length: itemWidth, offset: (itemWidth + itemMargin) * index, index }
          )}
          initialScrollIndex={bookIndex}
          renderItem={({ item, index }) => {

            let title = item.volumeInfo.title
            const thumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w400-h600&source=gbs_api`
            let authors = item.volumeInfo.authors
            const description = item.volumeInfo.description
            const seiten = item.volumeInfo.pageCount

            return (
              <View
                className={`bg-[#F2F2F2] rounded-t-2xl mt-20 pt-1 pb-4 relative`}
                style={{
                  width: itemWidth,
                  marginLeft: index === 0 ? 0 : itemMargin / 2, // Adjust margin for first item
                  marginRight: index === 5 ? 0 : itemMargin / 2, // Adjust margin for last item
                }}
              >

                <TouchableOpacity onPress={closeModal} className=' absolute top-4 right-4 bg-[rgba(78,76,86,0.1)] rounded-full size-8 justify-center items-center z-10'>
                  <AntDesign name="close" size={18} color="black" />
                </TouchableOpacity>
                
                <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='pt-14 z-20'>
                  <View className='px-7'>
                    <View style={{
                      width: width * 0.6,
                      height: width * 0.9,
                      alignSelf: 'center',
                      shadowColor: 'black',
                      shadowOffset: { height: 10 },
                      shadowOpacity: 0.8,
                      shadowRadius: 20,
                      elevation: 3,
                    }}>
                      <Image
                        source={{ uri: thumbnail }}
                        
                        className='w-full h-full'
                        resizeMode="stretch"
                      />
                    </View>
                    <Text className="text-xl mt-5 font-bold text-center">{title}</Text>
                    {authors.map((author, index) => (<Text className="text-center text-gray-600">{author}</Text>))}
                    <View className="flex-col items-center gap-2 justify-center mt-3">
                      <TouchableOpacity className="flex-row  gap-2 bg-black py-2 px-4 w-7/12 h-12 items-center justify-center rounded-full">
                        <Text className="text-white font-bold text-lg">zur Leseliste</Text>
                        <Feather name="bookmark" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row  gap-2 bg-[#2DA786] px-4 w-7/12 h-12 items-center justify-center rounded-full">
                        <Text className="text-white font-bold text-lg">Lesen</Text>
                        <Feather name="book-open" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-center text-gray-600 text-lg font-semibold mt-2">Seiten: {seiten}</Text>
                    <Text className="mt-5 text-lg text-center text-[#8C8C8C] border-b border-b-0.5 border-[#8C8C8C] pb-3">Psychologie 📚 | Geografie 🌍 | Wissen 💡</Text>
                    <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">Beschreibung</Text>
                    <Text className="text-gray-500 mt-2 mb-12 text-base">
                      {description}
                    </Text>

                    <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">Ähnliche Bücher</Text>
                  </View>
                  <View className='px-2'>
                    <Empfehlungen books={booksInModal} loading={loadingInModal} openModal={openInnerModal} />
                  </View>
                </ScrollView>



              </View>
            );
          }}
        />
      </Animated.View>
      {innerModalVisible && (
        <Modal 
          books={booksInModal}
          closeModal={closeInnerModal}
          width={width}
          slideAnim={innerSlideAnim}
          scaleAnim={innerScaleAnim}
          bookIndex={innerBookIndex}
        />
      )}

    </>
  )
}

export default Modal