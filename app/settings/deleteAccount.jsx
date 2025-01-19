import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useRouter } from 'expo-router';
import { DeleteUserDb } from '@/lib/deleteUser';
import { account } from '@/lib/appwrite';  // Account import hinzufügen


export default function DeleteAccount() {
  const { user } = useGlobalContext();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Account löschen",
      "Bist du dir sicher, dass du deinen Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!",
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {

              const authUser = await account.get();

              const [dbResponse, authResponse] = await Promise.all([
                DeleteUserDb(user),                // Löscht aus DB Collection
                DeleteUserAuth(authUser.$id)         // Löscht aus Auth mit Auth-ID
              ]);



              if (dbResponse.status === "success" && authResponse.status === "success") {
                Alert.alert("Erfolg", "Dein Account wurde vollständig gelöscht");
                router.replace("/login");
              } else {
                Alert.alert("Fehler", 
                  dbResponse.status === "error" ? dbResponse.message : authResponse.message
                );
              }



            } catch (error) {
              Alert.alert("Fehler", "Ein unerwarteter Fehler ist aufgetreten");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white p-5">
      {/* Warning Section */}
      <View className="bg-red-50 p-4 rounded-xl mb-6">
        <Text className="text-red-800 font-bold text-lg mb-2">
          Achtung: Account löschen
        </Text>
        <Text className="text-red-600 mb-2">
          Wenn du deinen Account löschst:
        </Text>
        <View className="space-y-2">
          <Text className="text-red-600">• Werden alle deine Daten unwiderruflich gelöscht</Text>
          <Text className="text-red-600">• Dein Lesefortschritt geht verloren</Text>
          <Text className="text-red-600">• Gespeicherte Bücher werden entfernt</Text>
          <Text className="text-red-600">• Diese Aktion kann nicht rückgängig gemacht werden</Text>
        </View>
      </View>

      {/* Additional Info */}
      <View className="bg-gray-50 p-4 rounded-xl mb-8">
        <Text className="text-gray-600">
          Möchtest du stattdessen nur eine Pause einlegen? Du kannst dich auch einfach abmelden und deinen Account behalten.
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDeleteAccount}
        className="bg-red-500 p-4 rounded-xl"
      >
        <Text className="text-white font-bold text-center text-lg">
          Account löschen
        </Text>
      </TouchableOpacity>
    </View>
  );
}
