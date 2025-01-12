import { config, databases, ID } from "./appwrite";
import { Query } from "react-native-appwrite";

export default async function editActiveBooks(user, googleBooksId) {
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

    console.log("bookIndex: ", bookIndex)
    let bookId;

    if (activeBookDocument) {
      bookId = activeBookDocument.$id;
      if (bookIndex === -1) {
        // Füge das komplette Buch-Objekt hinzu
        userActiveBooks.push(activeBookDocument);
        console.log("Buch hinzugefügt:", activeBookDocument.$id);
      } else {
        userActiveBooks.splice(bookIndex, 1);
        console.log("Buch entfernt:", activeBookDocument.$id);
      }
    } else {
      const newActiveBook = await databases.createDocument(
        config.databaseId,
        config.activeBooksCollectionId,
        ID.unique(),
        {
          title: "Jude",
          googleBooksId: googleBooksId
        }
      );
      bookId = newActiveBook.$id;
      userActiveBooks.push(newActiveBook);
    }

    console.log("aktualisiere active Books:", userActiveBooks);

    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      user.$id,
      {
        activeBooks: userActiveBooks
      }
    );
    console.log("updated User ganz am Ende", updatedUser);

    console.log("hier kommt die query abfrage ob das buch schon in ProgressCollection drinnen ist");
    const progressDocumentList = await databases.listDocuments(
      config.databaseId,
      config.userBookProgressCollectionId,
      [
        Query.equal("userId", user.$id),
        Query.equal("activeBookId", bookId)
      ]
    );
    console.log("log nach der query");

    if (progressDocumentList.documents.length === 0) {
      await databases.createDocument(
        config.databaseId,
        config.userBookProgressCollectionId,
        ID.unique(),
        {
          userId: user.$id,
          activeBookId: bookId,
          bookProgress: 0
        }
      );
      console.log("progress got added");
    } else {
      const progressDocument = progressDocumentList.documents[0];
      if (bookIndex !== -1) {  // Wenn das Buch gefunden wurde (Index nicht -1)
        await databases.deleteDocument(
          config.databaseId,
          config.userBookProgressCollectionId,
          progressDocument.$id
        );
        console.log("progress document wurde gelöscht");
      } else {
        console.log("progress wird angepasst");
      }
    }

  } catch (error) {
    console.log("irgendwas läuft falsch", error);
  }
}
