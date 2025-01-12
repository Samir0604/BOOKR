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
    // Nimm das erste gefundene Buch-Dokument, wenn vorhanden
    const savedBookDocument = savedBookDocumentList.documents[0];

    // Benutzer-spezifische gespeicherte Bücher abrufen
    const UserSavedBooks = userDocument.savedBooks || [];


    // Überprüfen, ob das Buch bereits in den gespeicherten Büchern des Benutzers ist
    let BookInUserSavedBooks = false;

    if (UserSavedBooks.length !== 0) {
      // Überprüfen, ob das Buch in der Liste der gespeicherten Bücher ist
      BookInUserSavedBooks = UserSavedBooks.find(savedBook => {
        return savedBook.$id == savedBookDocument.$id;
      });
    }

    if (savedBookDocument) {
      // Buch-Dokument existiert bereits
      if (!BookInUserSavedBooks) {
        // Wenn das Buch nicht in den gespeicherten Büchern ist, hinzufügen
        UserSavedBooks.push(savedBookDocument.$id);
      } else {
        // Wenn das Buch bereits vorhanden ist, entfernen
        UserSavedBooks.splice(UserSavedBooks.indexOf(savedBookDocument.$id), 1);
      }
    } else {
      // Neues Buch-Dokument erstellen, da es noch nicht existiert
      const newSavedBookDocument = await databases.createDocument(
        config.databaseId,
        config.savedBooksCollectionId,
        ID.unique(),
        {
          googleBooksId: bookDocumentId,
          title: 'Allah' // Platzhalter für den Buchtitel, sollte durch den tatsächlichen Titel ersetzt werden
        }
      );
      // Füge das neu erstellte Buch zur Liste der gespeicherten Bücher hinzu
      UserSavedBooks.push(newSavedBookDocument.$id);
    }

    // Benutzer-Dokument mit aktualisierter Liste der gespeicherten Bücher aktualisieren
    await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      { savedBooks: UserSavedBooks }
    );
  } catch (error) {
    // Fehlerbehandlung: Fehler beim Aktualisieren des Benutzer-Dokuments protokollieren
    console.error("Error updating user document:", error);
  }
}
