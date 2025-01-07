import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { LinearGradient } from 'expo-linear-gradient';

import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';



import { swiperData } from "@/constants/swiperData";




const SwiperPages = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width: screenWidth } = Dimensions.get('window');
  const isLastSlide = activeIndex === swiperData.length - 1;
  const [containerWidth, setContainerWidth] = useState(0);





  return (



    <Swiper
      ref={swiperRef}
      loop={false}
      dot={
        <View className="size-2 bg-[#E2E8F0] rounded-full" />
      }
      activeDot={
        <View className="size-3 bg-[#2DA786] rounded-full" />
      }
      onIndexChanged={(index) => setActiveIndex(index)}
      paginationStyle={{ top: -80, alignItems: 'center' }}

    >
      {swiperData.map(({ id, title, description, borderLeftStyle, borderRightStyle, buttonText, colorLeft, colorRight, videoURL, metaDataTitle, metaDataArtist }) => {
        
        const assetId = videoURL;


        const VideoSource = {
          assetId,
          metadata: {
            title: metaDataTitle,
            artist: metaDataArtist,
          },
        };

        const player = useVideoPlayer(VideoSource, player => {
          player.loop = true;
          player.play();
        });

        const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
        return <View key={id} className={`flex-1 bg-white items-center justify-center overflow-hidden`}>
          <View className={`h-[40%] w-[160%]`} onLayout={(event) => {
            const { width } = event.nativeEvent.layout; // Gets the width of the container
            setContainerWidth(width);
          }}>


            <LinearGradient colors={[colorLeft, colorRight]}
              start={{ x: (1 - screenWidth / containerWidth) / 2, y: 0 }} // Startpunkt relativ zum Container
              end={{ x: (1 + screenWidth / containerWidth) / 2, y: 0 }}
              style={{ height: '100%', width: '100%', margin: 'auto', display: "flex", alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: borderRightStyle, borderBottomLeftRadius: borderLeftStyle, overflow: 'hidden' }}>
              <View style={{ width: screenWidth }} >
                <Text className="text-4xl px-14 font-bold text-white text-center">
                  {title}
                </Text>
                <Text className="text-xl font-semibold text-[#DDDDDD] text-center px-12 mt-4">
                  {description}
                </Text>

              </View>
            </LinearGradient>
          </View>

          <View className="flex-1 items-center">

            <TouchableOpacity
              className='rounded-full py-3 px-32 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 mt-20 mb-10 bg-[#2DA786]'
              onPress={() =>
                isLastSlide
                  ? router.push("/questions/categories")
                  : swiperRef.current?.scrollBy(1)
              }
            >
              <Text className='text-lg text-white font-bold '>
                {buttonText}
              </Text>
            </TouchableOpacity>

            <View className="flex-1 justify-center items-center ">
              <VideoView style={{ width: 350, height: 275, backgroundColor: 'transparent' }} player={player} allowsFullscreen allowsPictureInPicture nativeControls= {false}  />
            </View>

          </View>

        </View>

      })}
    </Swiper>



  );
};



export default SwiperPages;
