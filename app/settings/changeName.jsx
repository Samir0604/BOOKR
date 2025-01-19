import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { ChangeNameBackend } from '@/lib/changeName';
import { router } from 'expo-router';

export default function ChangeName() {
  const { user } = useGlobalContext();
  const [newName, setNewName] = useState('');

  const handleSubmit = async () => {
    if (!newName || newName.length < 2) {
      Alert.alert('Fehler', 'Der Name muss mindestens 2 Zeichen lang sein.');
      return;
    }

    try {
      const response = await ChangeNameBackend(newName, user);
      
      if (response?.status === "error") {
        Alert.alert('Fehler', response.message);
        return;
      }
      
      Alert.alert('Erfolg', 'Dein Name wurde erfolgreich geändert.');
      router.push("/(tabs)/home")
    } catch (error) {
      Alert.alert('Fehler', 'Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-5 mt-6">
        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-medium">Neuer Name</Text>
          <View className="relative">
            <TextInput
              className="h-14 bg-white border border-gray-200 rounded-xl px-4 w-full"
              placeholder="Gib deinen Namen ein"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 h-14 rounded-xl items-center justify-center mb-4"
        >
          <Text className="text-white font-bold text-lg">Name ändern</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
