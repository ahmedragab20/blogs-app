import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Blog } from '~/types';

export default class BlogHandler {
  static async create(blog: Blog) {
    try {
      const db: Firestore = useFirestore();
      const user = useCurrentUser();
      const data = {
        blogId: Generics.uuid(),
        ...blog,
        user: {
          uid: user.value?.uid,
          displayName: user.value?.displayName,
          email: user.value?.email,
          photoURL: user.value?.photoURL,
        },
      };
      return await addDoc(collection(db, 'blogs'), data);
    } catch (error) {
      Debug.error({
        message: '🚨 Error adding document',
        source: 'index.vue',
        data: error,
        useOnProduction: true,
      });
    }
  }
  static async update(blog: Partial<Blog>) {
    try {
      const db: Firestore = useFirestore();
      const querySnapshot = await getDocs(
        query(collection(db, 'blogs'), where('blogId', '==', blog.blogId))
      );

      for (const doc of querySnapshot.docs) {
        const docRef = doc.ref;

        if (!!docRef) {
          return updateDoc(docRef, {
            ...blog,
          });
        }
      }
    } catch (error) {}
  }
  static async delete(blogId: string) {
    try {
      const db: Firestore = useFirestore();
      const querySnapshot = await getDocs(
        query(collection(db, 'blogs'), where('blogId', '==', blogId))
      );

      for (const doc of querySnapshot.docs) {
        const docRef = doc.ref;

        if (!!docRef) {
          return await deleteDoc(docRef);
        }
      }
    } catch (error) {
      Debug.error({
        message: `Couldn't delete blog with id: ${blogId}`,
        data: error,
        useOnProduction: true,
      });
      throw createError({
        message: "Couldn't delete user",
        statusCode: 500,
      });
    }
  }
}
