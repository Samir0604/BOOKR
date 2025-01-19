import { account, config, databases } from "./appwrite"

export async function updateEmail(user, password, newEmail){
    try{
        if(!user || !password || !newEmail){
            console.log("email oder passwort fehlt")
            return{
                status: "error",
                messsage: "email or password is missing"
            }
        }

        const authResponse = await account.updateEmail(
            newEmail,
            password
        );

        console.log(authResponse)

        if(!authResponse){
            return{
                status: "error",
                message: "fehler beim auth update"
            }
        }

    }catch(authError){
        console.log(authError)
        return{
            status: "error",
            message: "fehler bei auth"
        }
    }

    try{

        const dbResponse = await databases.updateDocument(
            config.databaseId,
            config.usersCollectionId,
            user.$id,
            {
                email: newEmail
            }
        )

        console.log(dbResponse)

       

    }catch(dbError){
        return{
            status: "error",
            message: "fehler bei db"
        }
    }



    try{
        const verificationUrl = `exp://192.168.2.135:8081/--/verification?secret={secret}&userId=${user.$id}`;

        const verificationResponse = await account.createVerification(
            verificationUrl
        )

      

        return {
            status: "success",
            message: "Email wurde geändert und Verifikations-Email wurde gesendet"
        }


    }catch(verificationError){
        console.log(verificationError)
        return{
            status:"error",
            message:"verification error"
        }
    }


}