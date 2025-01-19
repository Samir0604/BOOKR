import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { account } from '@/lib/appwrite';

export default function VerificationPage() {
  const { secret, userId } = useLocalSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const completeVerification = async () => {
      try {
        // Debug-Ausgabe
        console.log("Received params:", { secret, userId });

        if (!secret || !userId) {
          Alert.alert('Fehler', 'Ungültige Verifizierungs-Parameter');
          router.replace('/(tabs)/profile');
          return;
        }

        await account.updateVerification(secret);
        
        Alert.alert(
          'Erfolg',
          'Deine E-Mail wurde erfolgreich verifiziert!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/profile')
            }
          ]
        );
      } catch (error) {
        console.error('Verification error:', error);
        Alert.alert(
          'Fehler',
          'Die Verifizierung konnte nicht abgeschlossen werden.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/profile')
            }
          ]
        );
      }
    };

    completeVerification();
  }, [secret, userId]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-gray-800">Verifizierung wird durchgeführt...</Text>
      <Text className="text-sm text-gray-500 mt-2">Bitte warten...</Text>
    </View>
  );
}
