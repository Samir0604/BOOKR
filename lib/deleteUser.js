import { account, config, databases, users } from "./appwrite";

export async function DeleteUserDb(user){

    if(user ){
        return{
            status: "error",
            message: "konnten keinen user finden lan"
        }
    }


    try{

        const response = await databases.deleteDocument(
            config.databaseId,
            config.usersCollectionId,
            user.$id
        )

        return{
            status: "success",
            message: "user got deleted from db"
        }



    }catch(authError){
        return{
            status: "error",
            message: "konnte user nicht aus auth löschen"
        }
    }   






}