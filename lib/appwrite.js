import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite"


export const config = {
    platform: "com.bookr",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
}


export const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)





export { OAuthProvider }
export const account = new Account(client)


