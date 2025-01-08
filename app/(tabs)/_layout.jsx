import React from 'react';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';



export default function TabLayout() {

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2DA786",
          tabBarStyle: {
            // fügt horizontales Padding hinzu
            backgroundColor: '#FFFFFF', // ändert die Hintergrundfarbe
            borderTopWidth: 0, // entfernt die obere Umrandung
            shadowOpacity: 0.1, // fügt Schatten hinzu (nur iOS),
            paddingTop: 10,
            height: 90
          },
          tabBarLabelStyle: {
            fontSize: 12, // ändert die Schriftgröße des Labels
            fontWeight: 'bold', // macht den Text fett,
            marginTop: 2
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Entypo name="home" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bibliothek"
          options={{
            title: "Bibliothek",
            tabBarLabel: "Bibliothek",
            tabBarIcon: ({ color }) => <Ionicons name="library" size={26} color={color} />,
          }}
        />

        <Tabs.Screen
          name="suche"
          options={{
            title: "Suche",
            tabBarLabel: "Suche",
            tabBarIcon: ({ color }) => <Fontisto name="search" size={26} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profil"
          options={{
            title: "Profil",
            tabBarLabel: "Profil",
            tabBarIcon: ({ color }) => <Ionicons name="person-sharp" size={26} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
