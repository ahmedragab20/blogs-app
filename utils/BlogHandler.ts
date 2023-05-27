import { Firestore, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { Blog } from '~/types';

export default class BlogHandler {
  private static readonly db: Firestore = useFirestore();

  static update(blog: Partial<Blog>) {
    // update blog in firestore database
  }
  static async delete(blogId: string) {
    // delete blog from firestore database
    try {
      const querySnapshot = await getDocs(
        query(collection(this.db, 'blogs'), where('id', '==', blogId))
      );

      Debug.log({
        message: `❶ Deleting blog with id: ${blogId}`,
        data: querySnapshot,
      });

      querySnapshot?.forEach(async (doc) => {
        Debug.log({
          message: `❷ Deleting blog with id: ${blogId}`,
          data: doc.data(),
        });
        const docRef = doc.ref;
        if (docRef) {
          Debug.log({
            message: `Deleting blog with id: ${blogId}`,
            data: doc.data(),
          });
          await deleteDoc(docRef);
        }
      });
    } catch (error) {
      console.error(error);
      throw createError({
        message: "Couldn't delete user",
        statusCode: 500,
      });
    }
  }
}
