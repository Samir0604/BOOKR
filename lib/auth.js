import { account, OAuthProvider, ID, config } from "@/lib/appwrite"
import * as Linking from "expo-linking"
import { openAuthSessionAsync } from "expo-web-browser";




export const signUpWithEnail = async (fullName, email, password) => {
  const newAccount = await account.create(
    ID.unique(),
    email,
    password,
    username
  )

  if (!newAccount) {
    throw Error;
  }

  await signIn(email, password)

  const newUser = await databases.createDocument(
    config.databaseId,
    config.usersCollectionId,
    ID.unique(),
    {
      accountId: newAccount.$id,
      email: email,
      username,
      avatar: avatarUrl,
    }
  )
  return newUser;


}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const loginWithGoogle = async () => {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(
      OAuthProvider.Google,
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

export const loginWithSpotify = async () => {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(
      OAuthProvider.Spotify,
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