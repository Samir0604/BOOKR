import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const Onboarding = () => {

  const { width: screenWidth } = Dimensions.get('window');

// top #217C62
// bottom #3BE2B3
  return (
    <View className="flex-1 relative items-center justify-center">
      
      <View className="items-center flex-1 justify-center">
      <LinearGradient colors={["#217C62","#3BE2B3"]} style={{height: '100%', width: screenWidth, display: "flex", justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('@/assets/logo/TemporaryBOOKRLogo.png')}
          className="size-50"
        />
         </LinearGradient>
      </View>
     


      <View className="flex-1 w-[160%] bg-white items-center justify-center  px-12 rounded-tl-[100%] rounded-tr-[75%] -mt-20"> {/* die width ist so hoch damit der rounded effekt wirkt */}
        <View className='px-6' style={{ width: screenWidth }}> {/* hier mache ich die width zur screenwidth damit die sachen innerhalb des containers noch im screen bleiben */}
          <View className='px-14'>
            <Text className="text-4xl font-bold mb-2 text-center">Willkommen bei BOOKR</Text>
            <Text className="text-lg text-center text-gray-600 mb-8">Finde Bücher für dich</Text>
          </View>

          <View className='mt-10 w-full items-center justify-center'>
            <TouchableOpacity className="w-full p-4 bg-[#217C62] rounded-2xl items-center mb-4">
              <Text className="text-white text-lg">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full p-4 bg-[#444242] rounded-2xl items-center">
              <Text className="text-white text-lg">Registrieren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
