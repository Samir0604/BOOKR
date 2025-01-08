import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ZurSammlung = () => {
  return (
    <View className="bg-white shadow-lg p-4 rounded-2xl mt-8">
      <View className="flex-col space-y-2">
        <Text className="text-black font-bold text-3xl">deine sammlung</Text>
        <Text className="text-gray-500 text-lg">
          Entdecke deine Sammlung die so unfassbar cool ist,wow
        </Text>
      </View>
      <View className="flex-row items-center justify-center mt-4">
        <TouchableOpacity className="bg-black items-center justify-center w-7/12 py-3 rounded-full">
          <Text className="text-white font-bold text-lg">Button Text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ZurSammlung;
