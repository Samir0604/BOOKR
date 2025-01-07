import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2DA786",
          tabBarStyle: {
            paddingVertical: 10, // fügt vertikales Padding hinzu
            paddingHorizontal: 20, // fügt horizontales Padding hinzu
            backgroundColor: '#FFFFFF', // ändert die Hintergrundfarbe
            borderTopWidth: 0, // entfernt die obere Umrandung
            shadowOpacity: 0.1, // fügt Schatten hinzu (nur iOS),
            paddingTop: 4
          },
          tabBarLabelStyle: {
            fontSize: 12, // ändert die Schriftgröße des Labels
            fontWeight: 'bold', // macht den Text fett
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bibliothek"
          options={{
            title: "Bibliothek",
            tabBarLabel: "Bibliothek",
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="suche"
          options={{
            title: "Suche",
            tabBarLabel: "Suche",
            tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profil"
          options={{
            title: "Profil",
            tabBarLabel: "Profil",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
