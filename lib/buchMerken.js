import { Query } from "react-native-appwrite";
import { config, databases, ID } from "./appwrite";

export default async function likeBook(user, bookDocumentId) {
  try {
    // Benutzer-Dokument abrufen




    const userDocument = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id
    );

    // Überprüfen, ob das Buch-Dokument bereits existiert
    const savedBookDocumentList = await databases.listDocuments(
      config.databaseId,
      config.savedBooksCollectionId,
      [Query.equal("googleBooksId", bookDocumentId)]
    );
    const savedBookDocument = savedBookDocumentList.documents[0];

    // Benutzer-spezifische gespeicherte Bücher
    const UserSavedBooks = userDocument.savedBooks || [];
    console.log(UserSavedBooks);

    console.log(UserSavedBooks.includes(savedBookDocument.$id));


    if (savedBookDocument) {
      // Buch-Dokument existiert bereits
      if (!UserSavedBooks.includes(savedBookDocument.$id)) {
        UserSavedBooks.push(savedBookDocument.$id);
      } else {
        UserSavedBooks.splice(UserSavedBooks.indexOf(savedBookDocument.$id), 1);
      }

    } else {
      // Neues Buch-Dokument erstellen
      const newSavedBookDocument = await databases.createDocument(
        config.databaseId,
        config.savedBooksCollectionId,
        ID.unique(),
        {
          googleBooksId: bookDocumentId,
          title: 'Allah'
        }
      );
      UserSavedBooks.push(newSavedBookDocument.$id);
    }

    // Benutzer-Dokument aktualisieren
    await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      { savedBooks: UserSavedBooks }
    );
  } catch (error) {
    console.error("Error updating user document:", error);
  }
}
