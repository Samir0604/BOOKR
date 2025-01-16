import { View, Text, ScrollView, Image, TouchableOpacity, Animated, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import Empfehlungen from '@/components/Empfehlungen';

const { width } = Dimensions.get('window');


const Bookpage = () => {

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }


  const {
    id,
    title,
    authors,
    description,
    pageCount,
    thumbnail,
    subject,
    item
  } = useLocalSearchParams();

  const { user } = useGlobalContext();
  const scrollY = useRef(new Animated.Value(0)).current;



  const [showFullDescription, setShowFullDescription] = useState(false);


  return (
    <SafeAreaView edges={['left', 'right']} className='flex-1 bg-white'>
      <Animated.View
        className='absolute top-0 left-0 right-0 z-50'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [width * 0.4, width * 0.6, width * 0.7, width * 0.8, width * 0.94 + 60],  // Start ab Bildschirmmitte
            outputRange: [0, 0.1, 0.3, 0.6, 1],  // Sehr graduelle Erhöhung
            extrapolate: 'clamp',
          }),
        }}
      >
        <BlurView intensity={20} tint="light" className='absolute top-0 left-0 right-0 bottom-0' />
        <LinearGradient
          colors={['#87BAAC', 'rgba(255,255,255,0.8)']}
          className='w-full'
        >
          <SafeAreaView>
            <View className='flex-row items-center justify-between px-5 mt-3 h-6'>
              <TouchableOpacity onPress={() => { router.back() }}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text className='text-lg font-medium'>{title?.length > 25 ? title.substring(0, 25) + "..." : title}</Text>
              <View className='w-8' />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        className='absolute top-0 left-0 z-50 p-5 pt-3'
        style={{
          opacity: scrollY.interpolate({
            inputRange: [width * 0.4, width * 0.6, width * 0.7, width * 0.8, width * 0.94 + 60],
            outputRange: [1, 0.9, 0.6, 0.3, 0],  // Entsprechend angepasst
            extrapolate: 'clamp',
          }),
        }}
      >
        <SafeAreaView>
          <TouchableOpacity onPress={() => { router.back() }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerClassName="px-7 pt-40"
      >
        <View>
          <View style={{
            width: width * 0.6,    // 60% der Bildschirmbreite
            height: width * 0.94,   // 94% der Bildschirmbreite
            alignSelf: 'center',
            shadowColor: 'black',
            shadowOffset: { height: 10 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 3,
          }} >
            <Image
              source={{ uri: `https://books.google.com/books/publisher/content/images/frontcover/${id}?fife=w400-h600&source=gbs_api` }}
              className="w-full h-full"
              resizeMode="stretch"
            />
          </View>

          <Text className="text-xl mt-5 font-bold text-center">
            {title}
          </Text>

          {authors?.map((author, id) => (
            <Text key={id} className="text-center text-gray-600">
              {author}
            </Text>
          ))}

          <View className="flex-col items-center justify-center mt-3">
            <TouchableOpacity
              onPress={() => likeBook(user, id, item)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
              }}
              className="flex-row gap-2 bg-black px-4 w-8/12 h-14 items-center justify-center rounded-full mb-3"
            >
              <Text className="text-white font-bold text-lg">zur Leseliste</Text>
              <Feather name="bookmark" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => editActiveBooks(user, id, item)}
              style={{
                shadowColor: '#2DA786',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 8,
              }}
              className="flex-row gap-2 bg-[#2DA786] px-4 w-8/12 h-14 items-center justify-center rounded-full"
            >
              <Text className="text-white font-bold text-lg">Lesen</Text>
              <Feather name="book-open" size={24} color="white" />
            </TouchableOpacity>

          </View>

          <Text className="text-center text-gray-600 text-lg font-semibold mt-2">
            Seiten: {pageCount}
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
    {description && (showFullDescription
      ? description
      : description?.substring(0, 500) + "..."
    )}
  </Text>
  {description && description.length > 500 && !showFullDescription && (
    <TouchableOpacity
      onPress={() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            400,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity
          )
        );
        setShowFullDescription(true);
      }}
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
  {description && (
    <View className="mb-12" />
  )}
</View>


        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default Bookpage;
