import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import Empfehlungen from './Empfehlungen';
import { useModal } from './useModal';
import { useGlobalContext } from '@/context/GlobalProvider';
import editActiveBooks from '@/lib/editActiveBooks';
import { AntDesign } from '@expo/vector-icons';
import likeBook from '@/lib/buchMerken';

// Cache für API-Anfragen
const apiCache = new Map();

const Modal = ({ books, closeModal, width, slideAnim, scaleAnim, bookIndex, first = false, depth = 0 }) => {
  const { user } = useGlobalContext();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const itemWidth = width * 0.92;
  const itemMargin = width * 0.02;
  const snapInterval = itemWidth + itemMargin;

  const {
    modalVisible: innerModalVisible,
    bookIndex: innerBookIndex,
    slideAnim: innerSlideAnim,
    scaleAnim: innerScaleAnim,
    openModal: openInnerModal,
    closeModal: closeInnerModal
  } = useModal();

  const MAX_DEPTH = 3;
  const scrollViewRef = useRef(null);

  const getRecommendations = async (book) => {
    if (!book) return [];
    
    setLoading(true);
    const cacheKey = `recommendations-${book.id}`;
    
    try {
      if (apiCache.has(cacheKey)) {
        setRecommendations(apiCache.get(cacheKey));
        setLoading(false);
        return;
      }
  
      const {
        volumeInfo: {
          categories = [],
          authors = [],
          title = '',
          language = 'de'
        }
      } = book;
  
      // 1. Zwei Bücher vom selben Autor
      let authorBooks = [];
      if (authors[0]) {
        const authorResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes`, {
            params: {
              q: `inauthor:"${authors[0]}"`,
              langRestrict: language,
              maxResults: 20,
              orderBy: 'relevance',
              key: 'AIzaSyAn6btAVaCvejincnVsL-QCeDOghDMvulQ'
            }
          }
        );
  
        const existingTitles = new Set([title.toLowerCase().trim()]);
  
        authorBooks = (authorResponse.data?.items || [])
          .filter(b => {
            const bookTitle = b.volumeInfo?.title?.toLowerCase().trim();
            if (existingTitles.has(bookTitle)) return false;
            if (
              bookTitle &&
              b.volumeInfo?.authors?.length > 0 &&
              b.volumeInfo?.imageLinks?.thumbnail
            ) {
              existingTitles.add(bookTitle);
              return true;
            }
            return false;
          })
          .slice(0, 2);
      }
  
      // 2. Drei Bücher aus der gleichen Kategorie
      let categoryBooks = [];
      if (categories[0]) {
        const categoryResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes`, {
            params: {
              q: `subject:"${categories[0]}"`,
              langRestrict: language,
              maxResults: 40,
              orderBy: 'relevance',
              key: 'AIzaSyAn6btAVaCvejincnVsL-QCeDOghDMvulQ'
            }
          }
        );
  
        const existingTitles = new Set([
          title.toLowerCase().trim(),
          ...authorBooks.map(b => b.volumeInfo.title.toLowerCase().trim())
        ]);
  
        let filteredBooks = (categoryResponse.data?.items || [])
          .filter(b => {
            const bookTitle = b.volumeInfo?.title?.toLowerCase().trim();
            const ratings = b.volumeInfo?.ratingsCount || 0;
            const avgRating = b.volumeInfo?.averageRating || 0;
            
            return (
              !existingTitles.has(bookTitle) &&
              !b.volumeInfo?.authors?.includes(authors[0]) &&
              b.volumeInfo?.title &&
              b.volumeInfo?.authors?.length > 0 &&
              b.volumeInfo?.imageLinks?.thumbnail &&
              ratings >= 3 && 
              avgRating >= 3.5
            );
          })
          .sort((a, b) => {
            const ratingA = a.volumeInfo.averageRating || 0;
            const ratingB = b.volumeInfo.averageRating || 0;
            return ratingB - ratingA;
          });
  
        if (filteredBooks.length < 3) {
          filteredBooks = (categoryResponse.data?.items || [])
            .filter(b => {
              const bookTitle = b.volumeInfo?.title?.toLowerCase().trim();
              return (
                !existingTitles.has(bookTitle) &&
                !b.volumeInfo?.authors?.includes(authors[0]) &&
                b.volumeInfo?.title &&
                b.volumeInfo?.authors?.length > 0 &&
                b.volumeInfo?.imageLinks?.thumbnail
              );
            });
        }
  
        categoryBooks = filteredBooks.slice(0, 3);
      }
  
      let validBooks = [...authorBooks, ...categoryBooks];

      // Enrichment Step: Für jedes Buch die beste Version finden
      const enrichedBooks = await Promise.all(
        validBooks.map(async (book) => {
          try {
            const enrichResponse = await axios.get(
              `https://www.googleapis.com/books/v1/volumes`, {
                params: {
                  q: `intitle:"${book.volumeInfo.title}" inauthor:"${book.volumeInfo.authors[0]}"`,
                  langRestrict: language,
                  maxResults: 1,
                  orderBy: 'relevance',
                  key: 'AIzaSyAn6btAVaCvejincnVsL-QCeDOghDMvulQ'
                }
              }
            );

            // Wenn ein Ergebnis gefunden wurde und es ein Thumbnail hat,
            // verwende das neue Ergebnis, sonst behalte das originale Buch
            if (
              enrichResponse.data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail &&
              enrichResponse.data?.items?.[0]?.volumeInfo?.title
            ) {
              return enrichResponse.data.items[0];
            }
            return book;
          } catch (error) {
            console.error('Fehler beim Enrichment:', error);
            return book; // Bei Fehler originales Buch behalten
          }
        })
      );
  
      apiCache.set(cacheKey, enrichedBooks);
      setRecommendations(enrichedBooks);
  
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
};


  useEffect(() => {
    if (books[bookIndex]) {
      getRecommendations(books[bookIndex]);
    }
  }, [bookIndex, books]);

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
          pagingEnabled
          bounces={false}
          snapToInterval={snapInterval}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: itemWidth,
            offset: (itemWidth + itemMargin) * index,
            index
          })}
          initialScrollIndex={bookIndex}
          renderItem={({ item, index }) => (
            <View
              className="bg-[#F2F2F2] rounded-t-2xl mt-20 pt-1 pb-4 relative"
              style={{
                width: itemWidth,
                marginLeft: index === 0 ? 0 : itemMargin / 2,
                marginRight: index === books.length - 1 ? 0 : itemMargin / 2,
              }}
            >
              <TouchableOpacity onPress={closeModal} className='absolute top-4 right-4 bg-[rgba(78,76,86,0.1)] rounded-full size-8 justify-center items-center z-10'>
                <AntDesign name="close" size={18} color="black" />
              </TouchableOpacity>
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pt-14 z-20"
              >
                <View className="px-7">
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
                      source={{ uri: `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w400-h600&source=gbs_api` }}
                      className="w-full h-full"
                      resizeMode="stretch"
                    />
                  </View>
                  
                  <Text className="text-xl mt-5 font-bold text-center">
                    {item.volumeInfo.title}
                  </Text>
                  
                  {item.volumeInfo.authors?.map((author, idx) => (
                    <Text key={idx} className="text-center text-gray-600">
                      {author}
                    </Text>
                  ))}

                  <View className="flex-col items-center gap-2 justify-center mt-3">
                    <TouchableOpacity 
                    onPress={()=>likeBook(user, item.id, item)}
                    className="flex-row gap-2 bg-black py-2 px-4 w-7/12 h-12 items-center justify-center rounded-full">
                      <Text className="text-white font-bold text-lg">zur Leseliste</Text>
                      <Feather name="bookmark" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => editActiveBooks(user, item.id, item)}
                      className="flex-row gap-2 bg-[#2DA786] px-4 w-7/12 h-12 items-center justify-center rounded-full"
                    >
                      <Text className="text-white font-bold text-lg">Lesen</Text>
                      <Feather name="book-open" size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-center text-gray-600 text-lg font-semibold mt-2">
                    Seiten: {item.volumeInfo.pageCount}
                  </Text>

                  <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
                    Beschreibung
                  </Text>
                  
                  <Text className="text-gray-500 mt-2 mb-12 text-base">
                    {item.volumeInfo.description}
                  </Text>
                </View>

                {depth < 2 && (
                  <View className="px-2 mt-3">
                    <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
                      Ähnliche Bücher
                    </Text>
                    <Empfehlungen
                      books={recommendations}
                      loading={loading}
                      openModal={openInnerModal}
                      inModal={true}
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        />
      </Animated.View>

      {innerModalVisible && depth < MAX_DEPTH && (
        <Modal
          books={recommendations}
          closeModal={closeInnerModal}
          width={width}
          slideAnim={innerSlideAnim}
          scaleAnim={innerScaleAnim}
          bookIndex={innerBookIndex}
          depth={depth + 1}
        />
      )}
    </>
  );
};

export default Modal;
