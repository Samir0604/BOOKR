import { Account, Avatars, Client, OAuthProvider, ID, Databases, } from "react-native-appwrite"


export const config = {
    platform: "com.bookr",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE,
    usersCollectionId :process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    savedBooksCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SAVEDBOOKS_COLLECTION_ID,
    activeBooksCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ACTIVEBOOKS_COLLECTION_ID,
    userBookProgressCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERBOOKPROGRESS_COLLECTION_ID
}


export const client = new Client();
export const account = new Account(client)
export const databases = new Databases(client);


client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)





export { OAuthProvider, ID }



