import { config, databases } from "./appwrite";

export default async function getSavedBooks(user, googleBookId){

    try {


        
            if(!user){
                console.log("kein user gepassed")
                return
            }

            const userDocument = await databases.getDocument(
                config.databaseId,
                config.usersCollectionId,
                user.$id
            );
    
            if (!userDocument.savedBooks || userDocument.savedBooks.length === 0 && !googleBookId) {
                console.log("Keine gemerkten Bücher gefunden");
                return null;
            }
        
            // Da das erste Element des Arrays bereits das vollständige Buch-Objekt ist,
            // können wir es direkt zurückgeben
            const savedBooks = userDocument.savedBooks;

            if (googleBookId) {
                const savedBook = savedBooks.find((book) => {
                    return book.googleBooksId == googleBookId;
                });

                if (savedBook && savedBooks) {
                    return !!savedBook;
                } else {          
                    return !!savedBook;
                }
            }
            
            if (!savedBooks) {
                console.log("Kein gemerktes Buch für den User");
                return null;
            }
    
            // Wir können das zweite Database-Query komplett weglassen,
            // da wir bereits alle Buchinformationen haben
            return savedBooks;
    
        } catch (error) {
            console.error("Fehler beim Laden der gemerkten Bücher:", error);
            throw error;
        }

}
