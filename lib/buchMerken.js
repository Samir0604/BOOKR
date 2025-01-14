import { Query } from "react-native-appwrite";
import { config, databases, ID } from "./appwrite";

export default async function likeBook(user, googleBooksId, item) {
  try {
    // Benutzer-Dokument abrufen
    const userDocument = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id
    );

    // Überprüfen, ob das Buch bereits in savedBooks existiert
    const savedBooksDocumentList = await databases.listDocuments(
      config.databaseId,
      config.savedBooksCollectionId,
      [Query.equal("googleBooksId", googleBooksId)]
    );

    let savedBookDocument = null;
    if(savedBooksDocumentList && savedBooksDocumentList.documents.length > 0){
      savedBookDocument = savedBooksDocumentList.documents[0];
    }

    const userSavedBooks = userDocument.savedBooks || [];

    // Suche nach dem Buch anhand der googleBooksId
    const bookIndex = userSavedBooks.findIndex((savedBook) => {
      return savedBook.googleBooksId === googleBooksId;
    });

    console.log("bookIndex: ", bookIndex);

    if (savedBookDocument) {
      if (bookIndex === -1) {
        // Füge das komplette Buch-Objekt hinzu
        userSavedBooks.push(savedBookDocument);
        console.log("Buch hinzugefügt:", savedBookDocument.$id);
      } else {
        userSavedBooks.splice(bookIndex, 1);
        console.log("Buch entfernt:", savedBookDocument.$id);
      }
    } else {
      const authorsString = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unbekannter Autor";

      const newSavedBook = await databases.createDocument(
        config.databaseId,
        config.savedBooksCollectionId,
        ID.unique(),
        {
          title: item.volumeInfo.title,
          googleBooksId: googleBooksId,
          image: `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w400-h600&source=gbs_api`,
          authors: authorsString,
          description: item.volumeInfo.description || "",
          pages: item.volumeInfo.pageCount || 0
        }
      );
      userSavedBooks.push(newSavedBook);
    }

    console.log("Aktualisiere saved Books:", userSavedBooks);

    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      {
        savedBooks: userSavedBooks
      }
    );
    console.log("Updated User am Ende:", updatedUser);

  } catch (error) {
    console.log("Fehler in likeBook:", error);
  }
}
