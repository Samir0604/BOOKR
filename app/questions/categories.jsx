import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';



import { useGlobalContext } from '@/context/GlobalProvider';
import { SubmitCategories } from '@/lib/updatedCategories';




export default function Categories() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { user } = useGlobalContext();

  console.log(user)


  const handleCategoryPress = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Entfernen, wenn bereits vorhanden
        return prev.filter((item) => item !== category);
      } else if (prev.length < 5) {
        // Hinzufügen, wenn noch nicht ausgewählt und weniger als 5
        return [...prev, category];
      } else {
        // Maximal 5 Kategorien erlaubt
        Alert.alert("Maximal 5 Kategorien können ausgewählt werden.");
        return prev;
      }
    });
  };








///Component zum rendern der items
  const CategoryItem = ({ category, icon }) => {
    const isActive = selectedCategories.includes(category);
    return (
      <TouchableOpacity
        className={
          isActive
            ? 'bg-white border border-[#2DA786] p-3 rounded-[20px] self-start'
            : 'bg-white border border-black p-3 rounded-[20px] self-start'
        }
        onPress={() => handleCategoryPress(category)}
      >
        <Text className={
          isActive
          ? "text-[16px] color-[#2DA786]"
          : "text-[16px]"
        }>
          {icon} {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerClassName="mt-7 flex-col bg-white flex-1">
      <SafeAreaView className="bg-white flex-1">
        <View className="border-b-2 px-7 pb-4 border-[#DFDFDF]">
          <View className="">
            <Text className="text-3xl color-[#1B6350]">Erzähl uns etwas über dich</Text>
            <Text className="text-lg leading-[16px] mt-5">
              Wähle die Kategorien aus, die Dich interessieren. Ob spannende Thriller, inspirierende Sachbücher oder romantische Geschichten – einfach anklicken und loslegen!
            </Text>
          </View>
        </View>

        <View className="flex flex-row flex-wrap mt-10 mx-7 gap-2">
          <CategoryItem category={"Kunst"} icon={"🎨"} />
          <CategoryItem category={"Fantasy"} icon={"🧚"} />
          <CategoryItem category={"Historisch"} icon={"🏛️"} />
          <CategoryItem category={"Horror"} icon={"🧟"} />
          <CategoryItem category={"Business"} icon={"🏢"} />
          <CategoryItem category={"Thriller"} icon={"🕵️"} />
          <CategoryItem category={"Gesundheit & Fitness"} icon={"💪"} />
          <CategoryItem category={"Religion"} icon={"🙏"} />
          <CategoryItem category={"Comics"} icon={"💥"} />
          <CategoryItem category={"Märchen"} icon={"🦄"} />
          <CategoryItem category={"Kochen"} icon={"👨‍🍳"} />
          <CategoryItem category={"Comedy"} icon={"😂"} />
          <CategoryItem category={"Kinderbücher"} icon={"🧸"} />
          <CategoryItem category={"Finanzen & Wirtschaft"} icon={"📈"} />
          <CategoryItem category={"Akademische Werke"} icon={"🎓"} />
          <CategoryItem category={"Biografie"} icon={"👤"} />
          <CategoryItem category={"Sachbuch"} icon={"📚"} />
          <CategoryItem category={"Science-Fiction"} icon={"👽"} />
          <CategoryItem category={"Abenteuer"} icon={"🧗"} />
          <CategoryItem category={"Romantisch"} icon={"🌹"} />
          <CategoryItem category={"Politik"} icon={"👨‍💼"} />
        </View>

        <View className="flex flex-row mx-7 mt-12 items-center justify-between">
          
          <Text className="font-bold text-lg">Überspringen</Text>
         
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">{selectedCategories.length}/5 ausgewählt</Text>
            <TouchableOpacity 
            className="bg-black rounded-full p-2"
            onPress={()=>SubmitCategories(user, selectedCategories)}
            >
              <SimpleLineIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
