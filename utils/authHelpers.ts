import { FirestoreUser } from '@/types';
import { User } from 'firebase/auth';
import { Firestore, addDoc, collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';

export const addFirestoreUser = async (db: Firestore, user: User) => {
  return await addDoc(collection(db, 'users'), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
  });
};

export const updateFirestoreUser = async (db: Firestore, user: FirestoreUser) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot?.forEach(async (doc) => {
      const data = doc.data();

      if (data.uid === user.uid) {
        const docRef = doc.ref;

        if (!!docRef) {
          await updateDoc(docRef, {
            ...user,
          });

          return;
        }
      }
    });
  } catch (error) {
    console.error(error);

    throw createError({
      message: "Couldn't update user",
      statusCode: 500,
    });
  }
};

export const deleteFirestoreUser = async (db: Firestore, user: FirestoreUser) => {
  if (!user.uid) {
    throw createError({
      message: "Send user's uid",
      statusCode: 500,
    });
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot?.forEach(async (doc) => {
      const data = doc.data();

      if (data.uid === user.uid) {
        const docRef = doc.ref;

        if (!!docRef) {
          await deleteDoc(docRef);

          return;
        }
      }
    });
  } catch (error) {
    console.error(error);

    throw createError({
      message: "Couldn't delete user",
      statusCode: 500,
    });
  }
};
