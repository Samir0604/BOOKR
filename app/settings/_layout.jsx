
import React from 'react'
import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    >

        <Stack.Screen name='konto' options={{ title: "Konto Einstellungen" }} />
        <Stack.Screen name='support' options={{ title: "Support" }} />
        <Stack.Screen name='privacy' options={{ title: "Datenschutz", headerShown:false}} />
        <Stack.Screen name='businessInfo' options={{ title: "Datenschutz", headerShown:false}} />




    </Stack>
  )
}

export default SettingsLayout