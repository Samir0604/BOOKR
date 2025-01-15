import { Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

export async function editBookProgress(user, googleBooksId, currentPage, totalPages) {
    try {
        // suche nach Buch aus activeBooks collection
        const activeBooksDocumentList = await databases.listDocuments(
            config.databaseId,
            config.activeBooksCollectionId,
            [Query.equal("googleBooksId", googleBooksId)]
        );

        // check ob das Buch in der collection gefunden wurde 
        if (!activeBooksDocumentList.documents || activeBooksDocumentList.documents.length === 0) {
            console.log("Kein aktives Buch gefunden");
            return;
        }

        const activeBookDocument = activeBooksDocumentList.documents[0];


        // such nach progress mit user und bookId (von activeBooks document)
        const progressDocuments = await databases.listDocuments(
            config.databaseId,
            config.userBookProgressCollectionId,
            [
                Query.equal("userId", user.$id),
                Query.equal("activeBookId", activeBookDocument.$id)
            ]
        );

        if (!progressDocuments.documents || progressDocuments.documents.length === 0) {
            console.log("Kein Progress Document gefunden");
            return;
        }

        // Update das Progress Dokument
        const updateResponse = await databases.updateDocument(
            config.databaseId,
            config.userBookProgressCollectionId,
            progressDocuments.documents[0].$id,
            {
                currentPage: currentPage,
                totalPages: totalPages
            }
        );

        if (updateResponse) {
            console.log("Update successfully");
        } else {
            console.log("Update fehlgeschlagen");
        }

    } catch (error) {
        console.error("Fehler beim Update:", error);
        throw error; // Fehler weiterwerfen
    }
}
