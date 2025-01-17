import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';

export default function BusinessInfo() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-5">
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Geschäftsbedingungen
        </Text>
        <Text className="text-lg text-gray-700 mb-4">
          Willkommen bei unserer App! Bitte lesen Sie die folgenden Geschäftsbedingungen sorgfältig durch, bevor Sie unsere Dienste nutzen.
        </Text>
        
        <Text className="text-xl font-semibold text-gray-800 mb-3">
          1. Allgemeine Bestimmungen
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Diese Geschäftsbedingungen regeln die Nutzung unserer App und der damit verbundenen Dienstleistungen. Mit der Nutzung unserer App stimmen Sie diesen Bedingungen zu.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          2. Nutzung der App
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Die App darf nur für persönliche und nicht-kommerzielle Zwecke genutzt werden. Sie sind verantwortlich für alle Aktivitäten, die über Ihr Konto erfolgen.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          3. Benutzerkonto
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Sie müssen ein Benutzerkonto erstellen, um auf bestimmte Funktionen der App zugreifen zu können. Sie sind dafür verantwortlich, die Vertraulichkeit Ihrer Kontoinformationen zu wahren.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          4. Haftungsbeschränkung
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Wir haften nicht für direkte oder indirekte Schäden, die aus der Nutzung oder Unmöglichkeit der Nutzung unserer App entstehen.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          5. Änderungen der Geschäftsbedingungen
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Wir behalten uns das Recht vor, diese Geschäftsbedingungen jederzeit zu ändern. Die Änderungen werden mit der Veröffentlichung auf unserer App wirksam.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          6. Anwendbares Recht
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Diese Geschäftsbedingungen unterliegen dem Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten ist der Sitz der Meurer, Seidel & Torakai GbR.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-3">
          7. Kontakt
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Bei Fragen zu diesen Geschäftsbedingungen können Sie uns unter info@sixerrdesign.com kontaktieren.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
