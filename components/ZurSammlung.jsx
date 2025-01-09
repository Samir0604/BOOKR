import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ZurSammlung = () => {
  return (
    <View className="bg-white shadow-lg p-4 rounded-2xl mt-8 flex flex-col gap-[30px]">
      
      <View className="flex-col gap-2">
        <Text className="text-black font-bold text-3xl">Deine Sammlung</Text>
        <Text className="color-[#8C8C8C] text-lg font-medium">Lese Bücher und erhalte Belohnungen</Text>
      </View>

      <View className="flex-row items-center justify-center">
        
        <TouchableOpacity className='bg-black items-center justify-center w-7/12 py-3 rounded-full'>
            <Text className='text-white font-bold text-lg'>Zur Sammlung</Text>
        </TouchableOpacity>
      
      </View>
    </View>
  );
};

export default ZurSammlung;
