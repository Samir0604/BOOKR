import { config, databases, ID } from "./appwrite";
import { Query } from "react-native-appwrite";

export default async function editActiveBooks(user, googleBooksId, item) {
  try {
    const userDocument = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id
    );

    

    const activeBooksDocumentList = await databases.listDocuments(
      config.databaseId,
      config.activeBooksCollectionId,
      [Query.equal("googleBooksId", googleBooksId)]
    );

    let activeBookDocument = null;
    if(activeBooksDocumentList && activeBooksDocumentList.documents.length > 0){
      activeBookDocument = activeBooksDocumentList.documents[0];
    }

    const userActiveBooks = userDocument.activeBooks || [];

    // Suche nach dem Buch anhand der googleBooksId
    const bookIndex = userActiveBooks.findIndex((activeBook) => {
      return activeBook.googleBooksId === googleBooksId;
    });


    let bookId;

    if (activeBookDocument) {
      bookId = activeBookDocument.$id;
      if (bookIndex === -1) {
        // Füge das komplette Buch-Objekt hinzu
        userActiveBooks.push(activeBookDocument);
      } else {
        userActiveBooks.splice(bookIndex, 1);
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

      const newActiveBook = await databases.createDocument(
        config.databaseId,
        config.activeBooksCollectionId,
        ID.unique(),
        {
          title:title,
          googleBooksId: googleBooksId,
          image:`https://books.google.com/books/publisher/content/images/frontcover/${googleBooksId}?fife=w400-h600&source=gbs_api`,
          authors : authors,
          categories: categories,
          description : description,
          pages: pageCount
        }
      );
      bookId = newActiveBook.$id;
      userActiveBooks.push(newActiveBook);
    }


    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      {
        activeBooks: userActiveBooks
      }
    );

    const progressDocumentList = await databases.listDocuments(
      config.databaseId,
      config.userBookProgressCollectionId,
      [
        Query.equal("userId", user.$id),
        Query.equal("activeBookId", bookId)
      ]
    );

    if (progressDocumentList.documents.length === 0) {
      await databases.createDocument(
        config.databaseId,
        config.userBookProgressCollectionId,
        ID.unique(),
        {
          userId: user.$id,
          activeBookId: bookId,
          currentPage :0,
          totalPages : 250
        }
      );
    } else {
      const progressDocument = progressDocumentList.documents[0];
      if (bookIndex !== -1) {  // Wenn das Buch gefunden wurde (Index nicht -1)
        await databases.deleteDocument(
          config.databaseId,
          config.userBookProgressCollectionId,
          progressDocument.$id
        );
      } else {
      }
    }

  } catch (error) {
    console.log("irgendwas läuft falsch", error);
  }
}
