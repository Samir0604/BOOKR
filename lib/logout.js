import { account } from "./appwrite";

export async function Logout(){
    try{
        if(!account){
            console.log("kein user")
            return
        }
        const result = await account.deleteSession("current")
        console.log("logout successfull" ,result)
    }catch(error){
        console.log("logout went wrong: ", error)
    }
}