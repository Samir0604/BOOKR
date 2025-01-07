import {account, OAuthProvider} from "@/lib/appwrite"
import { resolveParentId } from "expo-router/build/useNavigation"

export const loginWithGoogle = async () => {
    try {
     const response = await account.createOAuth2Session(OAuthProvider.Google)
      console.log(response)
     if(!response){
        console.log("falsch")
     }
     return true 

     
    } catch (error) {
      console.error(error)
    }

   
  }