import { config, databases } from '@/lib/appwrite';
import { router } from 'expo-router';



export const SubmitCategories = async (user, selectedCategories) => {
  if (selectedCategories.length == 0) {
    console.log("keine Kategorien")
  } else if (!user) {
    console.log("user nicht gefunden")
  } else {
    const response = await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      {
        liked_categories: selectedCategories
      }
    )
    if (response) {
      console.log("update successfully")
      router.push("/(tabs)/home")
    } else {
      console.log("update went wrong")
    }
  }
}