import { account, OAuthProvider, ID, config, databases } from "@/lib/appwrite"
import * as Linking from "expo-linking"
import { openAuthSessionAsync } from "expo-web-browser";
import { Query } from "react-native-appwrite";




export const signUpWithEmail = async (fullName, email, password) => {

  const newAccount = await account.create(
    ID.unique(),
    email,
    password,
    fullName
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
      email,
      fullName,
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

    const response = await
      account.createOAuth2Token(
        OAuthProvider.Google, redirectUri
      );


    if (!response) {
      throw new Error("failed to login")
    }

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    )

    if (browserResult.type != "success") {
      throw new Error("failed to login")
    }


    const url = new URL(browserResult.url)

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("failed to login")
    }
    const session = await account.createSession(userId, secret)

    if (!session) {
      throw new Error("failed to create session")
    }


    const user = await account.get();
    const accountId = user.$id
    const email = user.email;
    const fullName = user.name




    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        accountId: accountId,
        email: email,
        fullName: fullName,
      }
    )

    return true


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

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error;
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents[0]; // ist ein object mit userdaten, da es aber nur einer ist, deswegen direkt [0] weil es der einzige im array ist
  } catch (error) {
    console.log(error);

  }
}