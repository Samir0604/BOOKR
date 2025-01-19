import { account } from "./appwrite";


export async function ChangePassword(oldPassword, newPassword){
    try{
        if(!oldPassword || !newPassword){
            console.log("wurde nicht genug gepassed")
            return
        }

        const response = await account.updatePassword(
            newPassword,
            oldPassword
        )


        if (response.$id) {  // Erfolgreiche Antwort hat eine $id
            return {
                status: "success",
                data: response
            };
        }

        return {
            status: "error",
            message: "Passwort konnte nicht geändert werden"
        };



    }catch(error){

        if(error.code===401){
            return{
                status: "error",
                message: "aktuelles Passwort ist falsch"
            }
        }

        return{
            status: "error",
            message: "ein Fehler ist aufgetreten",
            error: error
        }

    }
}