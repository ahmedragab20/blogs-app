import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Blog } from '~/types';

export default class BlogHandler {
  static async get(blogId: string) {
    try {
      const db: Firestore = useFirestore();
      const q = query(collection(db, 'blogs'), where('blogId', '==', blogId));
      const querySnapshot = await getDocs(q);
      const blog = querySnapshot.docs.map((doc) => doc.data())[0] as Blog;

      return blog;
    } catch (error) {
      Debug.error({
        message: '🚨 Error getting document',
        source: 'index.vue',
        data: error,
      });
    }
  }
  static async create(blog: Blog) {
    try {
      if (!blog) {
        !Generics.getObjectInfoSeparate(blog)?.keys?.length;

        Debug.error({
          message: `You must provide a blog data to create a blog`,
          source: 'BlogHandler.ts',
          data: blog,
        });
        return;
      }

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
      if (!blog.blogId) {
        Debug.error({
          message: `You must provide a blogId to update a blog`,
          source: 'BlogHandler.ts',
          data: blog,
        });

        return;
      }

      const db: Firestore = useFirestore();
      const querySnapshot = await getDocs(
        query(collection(db, 'blogs'), where('blogId', '==', blog.blogId), limit(1))
      );

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          ...blog,
        });
      } else {
        Debug.warn({
          message: `🚧 No blog found with id: ${blog.blogId}`,
          data: blog,
        });
      }
    } catch (error) {
      Debug.error({
        message: `Couldn't update blog with id: ${blog.blogId}`,
        data: error,
        useOnProduction: true,
      });
      throw createError({
        message: "Couldn't update user",
        statusCode: 500,
      });
    }
  }
  static async delete(blogId: string) {
    try {
      if (!blogId) {
        Debug.error({
          message: `You must provide a blogId to delete a blog`,
          source: 'BlogHandler.ts',
          data: blogId,
        });

        return;
      }

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
  static async getUserBlogs(userId: string) {
    try {
      if (!userId) {
        Debug.error({
          message: `You must provide a userId to get blogs`,
          source: 'BlogHandler.ts',
          data: userId,
        });
        return;
      }

      const db: Firestore = useFirestore();
      const q = query(collection(db, 'blogs'), where('user.uid', '==', userId));
      let data = [] as Blog[];

      return new Promise((resolve, reject) => {
        onSnapshot(q, (querySnapshot) => {
          data.length = 0;
          data = querySnapshot.docs.map((doc) => doc.data()) as Blog[];
          resolve(data.sort((a, b) => -Generics.sortByDate(a.createdAt, b.createdAt)));
        });
      });
    } catch (error) {
      Debug.error({
        message: `Couldn't get blogs for user with id: ${userId}`,
        data: error,
        useOnProduction: true,
      });
      throw createError({
        message: "Couldn't get blogs",
        statusCode: 500,
      });
    }
  }
  static async getAll() {
    try {
      const db: Firestore = useFirestore();
      const q = query(collection(db, 'blogs'));
      let data = [] as Blog[];

      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          data.length = 0;
          data = querySnapshot.docs.map((doc) => doc.data()) as Blog[];
          resolve(data.sort((a, b) => -Generics.sortByDate(a.createdAt, b.createdAt))); // the minus sign is to sort in descending order
        });

        // Return an unsubscribe function to stop listening to changes
        return () => {
          unsubscribe();
        };
      });
    } catch (error) {
      Debug.error({
        message: `Couldn't get blogs`,
        data: error,
        useOnProduction: true,
      });
      throw createError({
        message: "Couldn't get blogs",
        statusCode: 500,
      });
    }
  }
}
