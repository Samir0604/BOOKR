import { config, databases } from "./appwrite";

export default async function getActiveBooks(user) {
    try {
        const userDocument = await databases.getDocument(
            config.databaseId,
            config.usersCollectionId,
            user.$id
        );

        if (!userDocument.activeBooks || userDocument.activeBooks.length === 0) {
            console.log("Keine aktiven Bücher gefunden");
            return null;
        }
    
        // Da das erste Element des Arrays bereits das vollständige Buch-Objekt ist,
        // können wir es direkt zurückgeben
        const activeBook = userDocument.activeBooks[0];
        
        if (!activeBook) {
            console.log("Kein aktives Buch für den User");
            return null;
        }

        // Wir können das zweite Database-Query komplett weglassen,
        // da wir bereits alle Buchinformationen haben
        return activeBook;

    } catch (error) {
        console.error("Fehler beim Laden der aktiven Bücher:", error);
        throw error;
    }
}
