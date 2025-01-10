import { config, databases } from "./appwrite";


export default async function likeBook({user, bookId}) {
  const userDocument = await databases.getDocument(
    config.databaseId,
    config.usersCollectionId,
    user.$id
  );

  const liked = userDocument.likedBooks || [];
  console.log(id);

  // Video zu den Likes hinzufügen oder entfernen
  if (!liked.includes(bookId)) {
    liked.push(bookId);
  } else {
    liked.splice(liked.indexOf(bookId), 1);
  }

  // Dokument des Benutzers aktualisieren
  await databases.updateDocument(
    config.databaseId,
    config.usersCollectionId,
    user.$id,
    { liked }
  );
}