import { Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

export async function getBookProgress(user, googleBooksId) {
    try {
        // Suche nach Buch aus activeBooks collection
        const activeBooksDocumentList = await databases.listDocuments(
            config.databaseId,
            config.activeBooksCollectionId,
            [Query.equal("googleBooksId", googleBooksId)]
        );

        // Check, ob das Buch in der Collection gefunden wurde 
        if (!activeBooksDocumentList.documents || activeBooksDocumentList.documents.length === 0) {
            console.log("Kein aktives Buch gefunden");
            return;
        }

        const activeBookDocument = activeBooksDocumentList.documents[0];

        // Suche nach progress mit user und bookId (von activeBooks document)
        const progressDocumentList = await databases.listDocuments(
            config.databaseId,
            config.userBookProgressCollectionId,
            [
                Query.equal("userId", user.$id),
                Query.equal("activeBookId", activeBookDocument.$id)
            ]
        );

        if (!progressDocumentList.documents || progressDocumentList.documents.length === 0) {
            console.log("Kein Progress Document gefunden");
            return;
        }

        const progressDocument = progressDocumentList.documents[0];

        if (progressDocument) {
            return progressDocument.bookProgress;
        }

    } catch (error) {
        console.error("Fehler beim Update:", error);
        throw error; // Fehler weiterwerfen
    }
}
