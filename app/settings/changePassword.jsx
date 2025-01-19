import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChangePassword } from '@/lib/changePassword';
import { router } from 'expo-router';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleCurrentPasswordChange = (text) => {
    // Remove spaces from input
    const noSpaces = text.replace(/\s/g, '');
    setCurrentPassword(noSpaces);
    if (noSpaces.length === 0) {
      setErrors(prev => ({...prev, currentPassword: 'Passwort ist erforderlich'}));
    } else {
      setErrors(prev => ({...prev, currentPassword: ''}));
    }
  };

  const handleNewPasswordChange = (text) => {
    // Remove spaces from input
    const noSpaces = text.replace(/\s/g, '');
    setNewPassword(noSpaces);
    
    if (noSpaces.length === 0) {
      setErrors(prev => ({...prev, newPassword: 'Passwort ist erforderlich'}));
    } else if (!validatePassword(noSpaces)) {
      setErrors(prev => ({...prev, newPassword: 'Passwort erfüllt nicht die Anforderungen'}));
    } else {
      setErrors(prev => ({...prev, newPassword: ''}));
    }
  };

  const handleChangePassword = async() => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Fehler', 'Bitte fülle alle Felder aus.');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Fehler', 'Das neue Passwort erfüllt nicht alle Anforderungen.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Fehler', 'Das neue Passwort muss sich vom aktuellen unterscheiden.');
      return;
    }

    try{
        const result = await ChangePassword(currentPassword,  newPassword)
        if (result.status === "error") {
            Alert.alert("Fehler", result.message);
            return;
        }

        Alert.alert("Erfolg", "Passwort wurde erfolgreich geändert");

        router.push("/(tabs)/home")


    }catch(error){
        Alert.alert("Fehler", "Ein unerwarteter Fehler ist aufgetreten");
    }
  };





  const handleForgotPassword = () => {
    Alert.alert('Passwort zurücksetzen', 'Du wirst zur Passwort-Zurücksetzen-Seite weitergeleitet.');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white px-5 py-8">
        <Text className="text-3xl font-bold text-gray-800">Passwort ändern</Text>
        <Text className="text-gray-500 mt-2">
          Erstelle ein sicheres Passwort für dein Konto
        </Text>
      </View>

      {/* Main Content */}
      <View className="p-5 mt-6">
        {/* Current Password Input */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Aktuelles Passwort</Text>
          <View className="relative">
            <TextInput
              className={`h-14 bg-white border ${errors.currentPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 w-full`}
              placeholder="Gib dein aktuelles Passwort ein"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={handleCurrentPasswordChange}
            />
            <TouchableOpacity 
              className="absolute right-4 top-4"
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons 
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.currentPassword ? (
            <Text className="text-red-500 text-sm mt-1">{errors.currentPassword}</Text>
          ) : null}
        </View>

        {/* New Password Input */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-medium">Neues Passwort</Text>
          <View className="relative">
            <TextInput
              className={`h-14 bg-white border ${errors.newPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 w-full`}
              placeholder="Gib dein neues Passwort ein"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
            />
            <TouchableOpacity 
              className="absolute right-4 top-4"
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons 
                name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword ? (
            <Text className="text-red-500 text-sm mt-1">{errors.newPassword}</Text>
          ) : null}
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          className="bg-blue-500 h-14 rounded-xl items-center justify-center mb-4"
        >
          <Text className="text-white font-bold text-lg">Passwort ändern</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity 
          onPress={handleForgotPassword}
          className="items-center"
        >
          <Text className="text-blue-500 font-medium">
            Passwort vergessen?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Password Requirements */}
      <View className="px-5 mt-4">
        <Text className="text-gray-500 text-sm mb-2">Passwort-Anforderungen:</Text>
        <View className="space-y-1">
          <Text className="text-gray-500 text-sm">• Mindestens 8 Zeichen</Text>
          <Text className="text-gray-500 text-sm">• Eine Zahl</Text>
          <Text className="text-gray-500 text-sm">• Ein Großbuchstabe</Text>
          <Text className="text-gray-500 text-sm">• Ein Sonderzeichen</Text>
        </View>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
