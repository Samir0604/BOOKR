import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import React, { useState } from 'react';
import Logo from '@/assets/logo/TemporaryBOOKRLogo.png';

export default function Support() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      question: 'Wie erhalte ich Buchempfehlungen?',
      answer: 'Unsere App analysiert Ihre Lesegewohnheiten und Vorlieben, um personalisierte Buchempfehlungen zu geben.',
    },
    {
      question: 'Kann ich Bücher direkt in der App kaufen?',
      answer: 'Ja, Sie können Bücher direkt über unsere Partner in der App kaufen.',
    },
    {
      question: 'Wie kann ich mein Konto löschen?',
      answer: 'Um Ihr Konto zu löschen, gehen sie unter den Konto-Einstellungen auf "Konto Löschen"',
    },
  ];

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=Support Request');
  };

  return (
      <View className="flex-1 bg-gray-50 p-5">
        <View className="items-center mb-6">
          <Image source={Logo} className="w-40 h-40 mb-4" resizeMode="contain" />
          <Text className="text-lg text-gray-700 text-center">
          Willkommen auf der Support-Seite! Wenn Sie Fragen oder Probleme haben, stehen wir Ihnen gerne zur Verfügung.
        </Text>
        </View>
    
        <TouchableOpacity className="bg-blue-600 py-3 rounded-lg mb-6 shadow-lg" onPress={handleEmailPress}>
          <Text className="text-white text-center text-lg font-semibold">E-Mail an Support</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 mb-3">Häufig gestellte Fragen (FAQ)</Text>
        {faqs.map((faq, index) => (
          <View key={index} className="mb-3">
            <TouchableOpacity
              className="bg-white p-4 rounded-lg shadow-md"
              onPress={() => toggleFaq(index)}
            >
              <Text className="text-lg font-medium text-gray-800">{faq.question}</Text>
            </TouchableOpacity>
            {faqOpen === index && (
              <View className="bg-gray-100 p-4 rounded-lg mt-2 shadow-inner">
                <Text className="text-base text-gray-700">{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

  );
}
