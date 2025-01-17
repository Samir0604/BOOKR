import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';

export default function Privacy() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-5">
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Datenschutzerklärung
        </Text>
        <Text className="text-lg text-gray-700 mb-4">
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und halten uns strikt an die Regeln der Datenschutzgesetze. Nachfolgend informieren wir Sie umfassend über den Umgang mit Ihren Daten.
        </Text>
        
        <Text className="text-xl font-semibold text-gray-800 mb-3">
          1. Verantwortliche Stelle
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Verantwortliche Stelle im Sinne der Datenschutzgesetze ist die Meurer, Seidel & Torakai GbR, vertreten durch Tom Seidel, In der Hohl 14, 56743 Mendig, info@sixerrdesign.com.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          2. Erhebung und Speicherung personenbezogener Daten
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Wir erheben und speichern Ihre personenbezogenen Daten nur, soweit dies zur Erbringung unserer Dienstleistungen erforderlich ist. Dies umfasst z.B. Ihren Namen, Ihre E-Mail-Adresse und andere Kontaktinformationen.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          3. Zweck der Datenerhebung
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Die Erhebung der Daten erfolgt, um Ihnen personalisierte Buchempfehlungen zu geben und unsere Dienstleistungen zu verbessern.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          4. Weitergabe von Daten
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, wenn dies gesetzlich erlaubt ist oder Sie eingewilligt haben. Wir geben Ihre Daten nur an Partner weiter, die uns bei der Erbringung unserer Dienstleistungen unterstützen.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          5. Rechte der Betroffenen
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Sie haben das Recht, jederzeit Auskunft über die von uns über Sie gespeicherten Daten zu erhalten. Außerdem haben Sie das Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          6. Datenschutzbeauftragter
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Bei Fragen zum Datenschutz können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden: Tom Seidel, info@sixerrdesign.com.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          7. Änderungen dieser Datenschutzerklärung
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Wir behalten uns das Recht vor, diese Datenschutzerklärung bei Bedarf anzupassen, um den aktuellen rechtlichen Anforderungen zu entsprechen oder Änderungen unserer Dienstleistungen umzusetzen.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
