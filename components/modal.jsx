import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, FlatList, ScrollView, LayoutAnimation } from 'react-native';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import { BlurView } from 'expo-blur';

import { useGlobalContext } from '@/context/GlobalProvider';

import { AntDesign, Ionicons } from '@expo/vector-icons';

import Empfehlungen from './Empfehlungen';
import { useModal } from './useModal';

import likeBook from '@/lib/buchMerken';
import editActiveBooks from '@/lib/editActiveBooks';
import useBookStore from '@/stores/zustandBookHandling';

// Cache für API-Anfragen
const apiCache = new Map();

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Modal = ({ books, closeModal, width, slideAnim, likes, setLikes, actives, setActives, scaleAnim, bookIndex, first = false, depth = 0 }) => {

  const itemWidth = width * 0.92;
  const itemMargin = width * 0.02;
  const snapInterval = itemWidth + itemMargin;

  const { user } = useGlobalContext();

  const MAX_DEPTH = 3;
  const scrollViewRef = useRef(null);

  const [currentBookIndex, setCurrentBookIndex] = useState(bookIndex);

  const [showFullDescriptionMap, setShowFullDescriptionMap] = useState(new Map());

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsMap, setRecommendationsMap] = useState(new Map());

  const [loading, setLoading] = useState(false);

  const setRefreshBib = useBookStore((state) => state.setRefreshBib);
  const refreshBibAndBookProgress = useBookStore((state) => state.refreshBibAndBookProgress);

 

  const getRecommendations = async (book, currentIndex) => {
    if (!book) return;

    setLoading(true);
    const cacheKey = `recommendations-${book.id}-${currentIndex}`;

    try {
      if (apiCache.has(cacheKey)) {
        const cachedRecommendations = apiCache.get(cacheKey);
        setRecommendationsMap(prev => new Map(prev).set(currentIndex, cachedRecommendations));
        setLoading(false);
        return;
      }

      const {
        volumeInfo: {
          authors = [],
          title = '',
          language = 'de',
          categories = []
        },
        subject
      } = book;

      // API calls für das aktuelle Buch
      let allBooks = [];

      // 1. Bücher vom selben Autor mit gleichem Subject und Kategorie
      if (authors[0]) {
        const authorResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes`, {
          params: {
            q: `inauthor:"${authors[0]}" `,
            langRestrict: language,
            maxResults: 10,
            orderBy: 'relevance',
            key: API_KEY
          }
        });

        const authorBooks = (authorResponse.data?.items || [])
          .filter(b => {
            const bookTitle = b.volumeInfo?.title?.toLowerCase().trim();
            return (
              bookTitle !== title.toLowerCase().trim() &&
              b.volumeInfo?.authors?.length > 0 &&
              b.volumeInfo?.imageLinks?.thumbnail &&
              b.volumeInfo?.description &&
              b.volumeInfo?.pageCount
            );
          })
          .map(b => ({
            ...b,
            subject: subject
          }))
          .slice(0, 2);

        allBooks = [...allBooks, ...authorBooks];
      }

      // 2. Bücher aus dem gleichen Subject und Kategorie
      const categoryResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes`, {
        params: {
          q: `subject:"${subject}" subject:"${categories[0] || ''}"`,
          langRestrict: language,
          maxResults: 10,
          orderBy: 'relevance',
          key: API_KEY
        }
      });

      const categoryBooks = (categoryResponse.data?.items || [])
        .filter(b => {
          const bookTitle = b.volumeInfo?.title?.toLowerCase().trim();
          return (
            bookTitle !== title.toLowerCase().trim() &&
            !b.volumeInfo?.authors?.includes(authors[0]) &&
            b.volumeInfo?.title &&
            b.volumeInfo?.authors?.length > 0 &&
            b.volumeInfo?.imageLinks?.thumbnail &&
            b.volumeInfo?.description &&
            b.volumeInfo?.pageCount
          );
        })
        .map(b => ({
          ...b,
          subject: subject
        }))
        .slice(0, 3);

      allBooks = [...allBooks, ...categoryBooks];

      // Enrichment Step
      const enrichedBooks = await Promise.all(
        allBooks.map(async (book) => {
          try {
            const enrichResponse = await axios.get(
              `https://www.googleapis.com/books/v1/volumes`, {
              params: {
                q: `intitle:"${book.volumeInfo.title}" inauthor:"${book.volumeInfo.authors[0]}" subject:"${subject}" subject:"${categories[0] || ''}"`,
                langRestrict: language,
                maxResults: 1,
                orderBy: 'relevance',
                key: API_KEY
              }
            });

            if (
              enrichResponse.data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail &&
              enrichResponse.data?.items?.[0]?.volumeInfo?.description &&
              enrichResponse.data?.items?.[0]?.volumeInfo?.pageCount
            ) {
              return {
                ...enrichResponse.data.items[0],
                subject: subject
              };
            }
            return book;
          } catch (error) {
            return book;
          }
        })
      );

      // Cache die Ergebnisse
      apiCache.set(cacheKey, enrichedBooks);
      setRecommendationsMap(prev => new Map(prev).set(currentIndex, enrichedBooks));

    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
      setRecommendationsMap(prev => new Map(prev).set(currentIndex, []));
    } finally {
      setLoading(false);
    }
  };


  // Modifizierte handleLikeBook Funktion
  const handleLikeBook = async (user, item) => {
    try {
      const isCurrentlyLiked = likes.includes(item.id);

      // Optimistic update
      if (isCurrentlyLiked) {
        // Remove from likes
        setLikes(prevLikes => prevLikes.filter(id => id !== item.id));
      } else {
        // Add to likes
        setLikes(prevLikes => [...prevLikes, item.id]);
      }

      await likeBook(user, item.id, item);
      setRefreshBib(true)
    } catch (error) {
      // Revert on error
      if (isCurrentlyLiked) {
        setLikes(prevLikes => [...prevLikes, item.id]);
      } else {
        setLikes(prevLikes => prevLikes.filter(id => id !== item.id));
      }
      console.error('Error liking book:', error);
    }
  };

  const handleEditActiveBooks = async (user, item) => {
    const isCurrentlyActive = actives.includes(item.id)
    if (isCurrentlyActive) {
      // Remove from likes
      setActives(prevActives => prevActives.filter(id => id !== item.id));
    } else {
      // Add to likes
      setActives(prevActives => [...prevActives, item.id]);
    }
    await editActiveBooks(user, item.id, item);
    refreshBibAndBookProgress()
  };


  // FlatList onViewableItemsChanged Handler
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentBookIndex(newIndex);
    }
  }).current;

  const toggleDescription = (index) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        400,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setShowFullDescriptionMap(prev => new Map(prev).set(index, true));
  };

  const {
    modalVisible: innerModalVisible,
    bookIndex: innerBookIndex,
    slideAnim: innerSlideAnim,
    scaleAnim: innerScaleAnim,
    openModal: openInnerModal,
    closeModal: closeInnerModal
  } = useModal();


  // Reset recommendations und Cache wenn sich das Buch ändert
  useEffect(() => {
    if (books[bookIndex]) {
      setRecommendations([]); // Reset recommendations
      apiCache.clear(); // Clear cache
      getRecommendations(books[bookIndex]);
    }
  }, [bookIndex, books]);
  useEffect(() => {
    if (books[currentBookIndex]) {
      getRecommendations(books[currentBookIndex], currentBookIndex);
    }
  }, [currentBookIndex]);

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
        }}
      >
        {first && (
          <BlurView
            intensity={50}
            tint="dark"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
        )}

        <FlatList
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          data={books}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: width * 0.04,
          }}
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
          renderItem={({ item, index }) => {
            const showFullDescription = showFullDescriptionMap.get(index) || false;

            return <View
              className="bg-[#F2F2F2] rounded-t-2xl mt-20 pt-1 pb-4 relative"
              style={{
                width: itemWidth,
                marginLeft: index === 0 ? 0 : itemMargin / 2,
                marginRight: index === books.length - 1 ? 0 : itemMargin / 2,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={closeModal}
                className='absolute top-4 right-4 bg-[rgba(78,76,86,0.1)] rounded-full size-8 justify-center items-center z-10'
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}
              >
                <AntDesign name="close" size={18} color="black" />
              </TouchableOpacity>

              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pt-14 z-20"
                style={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
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
                      onPress={() => handleLikeBook(user, item)}
                      className="flex-row gap-2 bg-black py-2 px-4 w-7/12 h-12 items-center justify-center rounded-full"
                    >
                      <Text className="text-white font-bold text-lg">zur Leseliste</Text>
                      {likes.includes(item.id) ?
                        <Ionicons name="bookmark" size={24} color="white" /> :
                        <Ionicons name="bookmark-outline" size={24} color="white" />
                      }
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleEditActiveBooks(user, item)}
                      className="flex-row gap-2 bg-[#2DA786] px-4 w-7/12 h-12 items-center justify-center rounded-full"
                    >
                      <Text className="text-white font-bold text-lg">
                        {actives.includes(item.id) ? 'Am Lesen...' : 'Lesen'}
                      </Text>
                      {actives.includes(item.id) ?
                        <Feather name="book-open" size={24} color="white" /> :
                        <Feather name="book" size={24} color="white" />
                      }
                    </TouchableOpacity>
                  </View>

                  <Text className="text-center text-gray-600 text-lg font-semibold mt-2">
                    Seiten: {item.volumeInfo.pageCount}
                  </Text>

                  <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
                    Beschreibung
                  </Text>

                  <View>
                    <Text
                      className="text-gray-500 mt-2 text-justify"
                      style={{
                        opacity: showFullDescription ? 1 : 0.95,
                      }}
                    >
                      {item.volumeInfo.description && (showFullDescription
                        ? item.volumeInfo.description
                        : item.volumeInfo.description?.substring(0, 500) + "..."
                      )}
                    </Text>
                    {item.volumeInfo.description &&
                      item.volumeInfo.description.length > 500 &&
                      !showFullDescription && (
                        <TouchableOpacity
                          onPress={() => toggleDescription(index)}
                          className="mt-2 mb-2"
                        >
                          <View className="flex items-center justify-center">
                            <Text className="text-[#2DA786] font-bold text-base mt-2">
                              Mehr lesen
                            </Text>
                            <AntDesign
                              name="down"
                              size={16}
                              color="#2DA786"
                              style={{ marginTop: 4 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    {item.volumeInfo.description && (
                      <View className="mb-12" />
                    )}
                  </View>
                </View>

                {depth < 2 && (
                  <View className="px-2 mt-3">
                    <Text className="mt-5 text-[#8C8C8C] text-3xl font-medium text-center">
                      Ähnliche Bücher
                    </Text>
                    <Empfehlungen
                      books={recommendationsMap.get(index) || []}
                      loading={loading && currentBookIndex === index}
                      openModal={openInnerModal}
                      inModal={true}
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          }}
        />
      </Animated.View>

      {innerModalVisible && depth < MAX_DEPTH && (
        <Modal
          books={recommendationsMap.get(currentBookIndex) || []}
          closeModal={closeInnerModal}
          width={width}
          slideAnim={innerSlideAnim}
          scaleAnim={innerScaleAnim}
          bookIndex={innerBookIndex}
          depth={depth + 1}
          likes={likes}
          setLikes={setLikes}
          actives={actives}
          setActives={setActives}
        />
      )}
    </>
  );
};

export default Modal;
