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


    if (savedBookDocument) {
      if (bookIndex === -1) {
        // Füge das komplette Buch-Objekt hinzu
        userSavedBooks.push(savedBookDocument);
      } else {
        userSavedBooks.splice(bookIndex, 1);
      }
    } else {
      const isGoogleBooksFormat = !!item.volumeInfo;
      let authors, categories, title, description, pageCount;
      
      if (isGoogleBooksFormat) {
        // Google Books API Format
        authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unbekannter Autor";
        categories = item.volumeInfo.categories ? item.volumeInfo.categories.join(", ") : "Keine Kategorie";
        title = item.volumeInfo.title;
        description = item.volumeInfo.description;
        pageCount = item.volumeInfo.pageCount;
      } else {
        // Bibliotheks-Format
        authors = Array.isArray(item.authors) ? item.authors.join(", ") : item.authors || "Unbekannter Autor";
        categories = Array.isArray(item.categories) ? item.categories.join(", ") : item.categories || "Keine Kategorie";
        title = item.title;
        description = item.description;
        pageCount = item.pages;
      }

      const newSavedBook = await databases.createDocument(
        config.databaseId,
        config.savedBooksCollectionId,
        ID.unique(),
        {
          title: title,
          googleBooksId: googleBooksId,
          image: `https://books.google.com/books/publisher/content/images/frontcover/${googleBooksId}?fife=w400-h600&source=gbs_api`,
          authors: authors,
          categories: categories,
          description: description || "",
          pages: pageCount || 0,

        }
      );
      userSavedBooks.push(newSavedBook);
    }


    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      {
        savedBooks: userSavedBooks
      }
    );

  } catch (error) {
    console.log("Fehler in likeBook:", error);
  }
}
