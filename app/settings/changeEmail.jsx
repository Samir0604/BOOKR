import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateEmail } from '@/lib/updateEmail';
import { useGlobalContext } from '@/context/GlobalProvider';


export default function ChangeEmail() {
  const { user } = useGlobalContext();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email Validierung
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!newEmail || !password) {
      Alert.alert('Fehler', 'Bitte fülle alle Felder aus.');
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert('Fehler', 'Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    try {
      // Hier kommt deine Backend-Logik
      const backendResponse = await updateEmail(user, password, newEmail)

      if (backendResponse?.status === "error") {
        Alert.alert('Fehler', backendResponse.message);
        return;
      }


      Alert.alert('Erfolg', 'Bestätigungsmail wurde versendet.');
    } catch (error) {
      Alert.alert('Fehler', 'Ein Fehler ist aufgetreten.');
      console.log(error)
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-5 mt-6">
        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Neue E-Mail-Adresse</Text>
          <TextInput
            className="h-14 bg-white border border-gray-200 rounded-xl px-4 w-full"
            placeholder="Gib deine neue E-Mail ein"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        {/* Password Input */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-medium">Passwort</Text>
          <View className="relative">
            <TextInput
              className="h-14 bg-white border border-gray-200 rounded-xl px-4 w-full"
              placeholder="Gib dein Passwort ein"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 h-14 rounded-xl items-center justify-center mb-6"
        >
          <Text className="text-white font-bold text-lg">E-Mail ändern</Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-gray-600 text-sm">
            Nach dem Absenden erhältst du eine Bestätigungs-E-Mail an deine neue 
            E-Mail-Adresse. Klicke auf den Link in der E-Mail, um die Änderung 
            abzuschließen.
          </Text>
          <Text className="text-gray-600 text-sm mt-2">
            Bis zur Bestätigung bleibt deine aktuelle E-Mail-Adresse aktiv.
          </Text>
        </View>

        {/* Current Email Display */}
        <View className="mt-6">
          <Text className="text-gray-500 text-sm">Aktuelle E-Mail-Adresse:</Text>
          <Text className="text-gray-700 font-medium">{user?.email}</Text>
        </View>
      </View>
    </View>
  );
}
