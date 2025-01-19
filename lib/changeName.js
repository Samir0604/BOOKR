import { account, config, databases } from "./appwrite";

export async function ChangeNameBackend(newName, user){

    ///potenzielle fehler rausfiltern
    if(!newName){
        console.log("kein Name erhalten")
        return
    }
    if(!user){
        console.log("kein user gepassed")
        return
    }

    try{
        const response = await account.updateName(
            newName
        )
        if(!response.$id){
            return{
                status: "error",
                message: "fehler beim auth update"
            }
        }

    }catch(Autherror){
        return{
            status: "error",
            message: "fehler beim auth update"
        }
    }

    try{
        const updatedUser = await databases.updateDocument(
            config.databaseId,
            config.usersCollectionId,
            user.$id,
            {
                fullName: newName
            }
        )

        if(!updatedUser){
            throw new Error("Database update fehler")
        }


    }catch(dbError){
        console.error("Database update error:", dbError);

        return{
            status: "error",
            message: "Fehler beim updaten der db"
        }
    }

}