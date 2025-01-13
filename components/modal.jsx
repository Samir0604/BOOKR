import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Empfehlungen from './Empfehlungen';
import { useModal } from './useModal';
import { useGlobalContext } from '@/context/GlobalProvider';
import editActiveBooks from '@/lib/editActiveBooks';

const Modal = ({ books, closeModal, width, slideAnim, scaleAnim, bookIndex, first = false, depth = 0 }) => {
  const { user } = useGlobalContext();
  const [recommendationsMap, setRecommendationsMap] = useState({});
  const [loadingInModal, setLoadingInModal] = useState({});
  const [visibleSections, setVisibleSections] = useState({});

  // Konstanten für FlatList
  const itemWidth = width * 0.92;
  const itemMargin = width * 0.02;
  const snapInterval = itemWidth + itemMargin;

  // Modal States
  const {
    modalVisible: innerModalVisible,
    bookIndex: innerBookIndex,
    slideAnim: innerSlideAnim,
    scaleAnim: innerScaleAnim,
    openModal: openInnerModal,
    closeModal: closeInnerModal
  } = useModal();

  // Konstanten
  const MAX_DEPTH = 3;
  const BUFFER_DISTANCE = 200;

  // Refs
  const recommendationPositions = useRef({});
  const scrollViewRef = useRef(null);

  // Funktion zum Messen der Position der Empfehlungssektion
  const measureRecommendationSection = (bookId, event) => {
    const { y, height } = event.nativeEvent.layout
    recommendationPositions.current[bookId] = {
      start: y - height, // Etwas früher laden
      end: y + height
    }
  }

  const handleScroll = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset} = nativeEvent
    const currentScrollPosition = contentOffset.y
    const visibleHeight = layoutMeasurement.height

    // Prüfe für jedes Buch, ob dessen Empfehlungsbereich sichtbar ist
    Object.entries(recommendationPositions.current).forEach(([bookId, position]) => {
      const isVisible = (
        currentScrollPosition + visibleHeight >= position.start &&
        currentScrollPosition <= position.end
      )

      if (isVisible && !visibleSections[bookId]) {
        setVisibleSections(prev => ({...prev, [bookId]: true}))
        getRecommendationsForBook(bookId)
      }
    })
  }


  async function getRecommendationsForBook(bookId) {
    if (recommendationsMap[bookId]) return
    
    const book = books.find(b => b.id === bookId)
    if (!book) return
  
    try {
      setLoadingInModal(prev => ({...prev, [bookId]: true}))
      
      const {
        volumeInfo: {
          categories = [],
          language,
        }
      } = book
  
      // Wenn keine Kategorien vorhanden sind, früh zurückkehren
      if (!categories || categories.length === 0) {
        setRecommendationsMap(prev => ({
          ...prev,
          [bookId]: []
        }))
        return
      }
  
      let booksTemp = []
  
      // Erstelle Suchanfragen für jede Kategorie
      for (const category of categories) {
        try {
          const res = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=subject:"${encodeURIComponent(category)}"&langRestrict=${language}&maxResults=20&key=AIzaSyAn6btAVaCvejincnVsL-QCeDOghDMvulQ`
          )
          
          // Filtere Bücher
          const validBooks = res.data.items?.filter(book => 
            book.volumeInfo.title &&
            book.volumeInfo.description &&
            book.volumeInfo.authors?.length > 0 &&
            book.volumeInfo.imageLinks
          ) || []
  
          // Füge neue, nicht-doppelte Bücher hinzu
          for (const newBook of validBooks) {
            if (!booksTemp.some(b => b.id === newBook.id) && newBook.id !== bookId) {
              booksTemp.push(newBook)
            }
          }
        } catch (error) {
          console.error(`Error fetching books for category ${category}:`, error)
        }
      }
  
      // Nehme die ersten 5 Bücher
      const topBooks = booksTemp.slice(0, 5)
  
      // Lade detaillierte Informationen
      const enrichedBooks = await Promise.all(
        topBooks.map(async (book) => {
          try {
            const detailRes = await axios.get(
              `https://www.googleapis.com/books/v1/volumes/${book.id}?key=AIzaSyAn6btAVaCvejincnVsL-QCeDOghDMvulQ`
            )
            return detailRes.data
          } catch (error) {
            console.error(`Error fetching details for book: ${book.volumeInfo.title}`, error)
            return book
          }
        })
      )
  
      setRecommendationsMap(prev => ({
        ...prev,
        [bookId]: enrichedBooks
      }))
  
    } catch (error) {
      console.error('Error in getRecommendationsForBook:', error)
    } finally {
      setLoadingInModal(prev => ({...prev, [bookId]: false}))
    }
  }
  

 

  return (
    <>
      <Animated.View
        style={{
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
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
          contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          snapToInterval={snapInterval}
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
                  marginLeft: index === 0 ? 0 : itemMargin / 2,
                  marginRight: index === 5 ? 0 : itemMargin / 2,
                }}
              >
                <ScrollView 
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false} 
                  contentContainerClassName='pt-14 z-20'
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
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
                      <TouchableOpacity
                        onPress={() => editActiveBooks(user, item.id, item)}
                        className="flex-row  gap-2 bg-[#2DA786] px-4 w-7/12 h-12 items-center justify-center rounded-full">
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
                  </View>
                {/* Empfehlungssektion mit onLayout */}
                <View 
                    onLayout={(event) => measureRecommendationSection(item.id, event)}
                    className='px-2 mt-3'
                  >
                    <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
                      Ähnliche Bücher
                    </Text>
                    {visibleSections[item.id] && (
                      <Empfehlungen 
                        books={recommendationsMap[item.id] || []} 
                        loading={loadingInModal[item.id]} 
                        openModal={openInnerModal} 
                        inModal={true}
                      />
                    )}
                  </View>
                </ScrollView>
              </View>
            );
          }}
        />
      </Animated.View>

      {innerModalVisible && depth < MAX_DEPTH ? (
        <Modal
          books={recommendationsMap[books[bookIndex]?.id] || []}
          closeModal={closeInnerModal}
          width={width}
          slideAnim={innerSlideAnim}
          scaleAnim={innerScaleAnim}
          bookIndex={innerBookIndex}
          depth={depth + 1}
        />
      ) : null}
    </>
  )
} 
export default Modal