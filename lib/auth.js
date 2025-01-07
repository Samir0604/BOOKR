import { account, OAuthProvider } from "@/lib/appwrite"
import * as Linking from "expo-linking"
import { openAuthSessionAsync } from "expo-web-browser";
import * as WebBrowser from 'expo-web-browser'

export const loginWithGoogle = async () => {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create session");

    return true;


  } catch (error) {
    console.error(error);
    return false;
  }



}