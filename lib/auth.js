import { account, OAuthProvider } from "@/lib/appwrite"

export const loginWithGoogle = async () => {
  try {
    const response = await account.createOAuth2Session(OAuthProvider.Google, '@/app/questions/swiper', '/')
    console.log(response)
    if (!response) {
      console.log("falsch")
    }
    return true


  } catch (error) {
    console.error(error)
  }


}