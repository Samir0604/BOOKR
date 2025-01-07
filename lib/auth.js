import { account, OAuthProvider } from "@/lib/appwrite"

export const loginWithGoogle = async () => {
    try {
     const response = await account.createOAuth2Session(OAuthProvider.Google)
      console.log(response)
     if(!response){
        console.log("falsch")
     }
 
    } catch (error) {
      console.error(error)
    }
    return true





}