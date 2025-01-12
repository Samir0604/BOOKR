import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { config, databases } from '../lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Query } from 'react-native-appwrite';

export default function BookProgress() {
    //Fortschritt des Lesens im useState
  const [progress, setProgress] = useState(22); 
  const { user } = useGlobalContext();

  const radius = 90;  // Entspricht der Hälfte der Höhe des Halbkreises
  const strokeWidth = 6;
  const circumference = Math.PI * radius;  // Nur der obere Halbkreis
  const strokeDashoffset = circumference - (progress / 100) * circumference;

///function um progress in db zu speichern
const editProgress = async(bookId)=>{
    console.log(config.activeBooksCollectionId)
  try{


    const response = await databases.listDocuments(
      config.databaseId,
      config.activeBooksCollectionId,
        [Query.equal("bookId", bookId)]
    );
    
      if(response.documents.length > 0){
        const documentId = response.documents[0].$id
    

        const updatedResponse = await databases.updateDocument(
          config.databaseId,
          config.activeBooksCollectionId,
          documentId,
          {
            bookProgress: progress
          }
        );
    
        console.log("document updated", updatedResponse)
      }else{
        console.log("no document with this id found")
      }



  }
  catch(error){
      console.log("error jude", error)
  }



}





  return (
    <LinearGradient 
      colors={["rgba(255, 255, 255, 0.44)", "rgba(107, 180, 160, 0.33)"]}
      locations={[0.23, 0.77]}
      style={{
        borderRadius: 25,
        marginTop: 20,
      }}
    >

        {/* oberster Container */}
      <View className='flex flex-row p-3 items-center justify-between'>

        <Image source={require("@/assets/images/BuchBeispiel.png")} className='w-44 h-72'/>
        

        {/* Titel und Autor */}
        <View className='flex flex-col items-center w-auto'>
          <View className='flex flex-col justify-center gap-0'>
            <Text className='text-3xl font-bold'>Lichtenstein</Text>
            <Text className='text-2xl font-bold text-gray-500'>Simon Karper</Text>
          </View>


          {/* Fortschrittsanzeige im Halbkreis */}
          <View className="mt-2.5 flex items-center justify-center">
            <Svg width={radius * 2 + strokeWidth} height={radius + strokeWidth}>
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="#D3D3D3"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={0}
                transform={`rotate(180 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
              />
              {progress > 0 && (
                <Circle
                  cx={radius + strokeWidth / 2}
                  cy={radius + strokeWidth / 2}
                  r={radius}
                  stroke="#6BB4A0"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(180 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
                />
              )}
            </Svg>


            {/* Progress in & unter Halbkreis */}
            <View className='absolute top-0 bottom-0 flex flex-col items-center justify-center mt-10'>
              <Text className='text-4xl font-bold'>{progress}%</Text>
              <Text className='text-2xl font-semibold'>geschafft</Text>
            </View>
          </View>

            {/* Button zun anpassen */}
          <TouchableOpacity 
            className='bg-black items-center justify-center p-3 rounded-full mt-10'
            onPress={() => editProgress("ImAGEAAAQBAJ")}
          >
            <Text className='text-white font-bold text-lg'>Fortschritt anpassen</Text>
          </TouchableOpacity>



        </View>
      </View>
    </LinearGradient>
  );
}
