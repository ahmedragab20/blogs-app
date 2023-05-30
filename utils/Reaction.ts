import { Blog, BlogReaction, FirestoreUser } from '~/types';

export default class Reaction {
  protected static buttonSleeping: boolean;
  private static delayTime: number = 1000;

  // setter for buttonSleeping
  protected static async sleep() {
    return new Promise((resolve) => setTimeout(resolve, Reaction.delayTime));
  }

  static async react(blog: Partial<Blog>, reaction: BlogReaction) {
    /**
     * Scenario 1: the user will add reaction to the blog
     * - if that reaction already exists, add the user to the reaction
     * - if that reaction does not exist, create a new reaction and add the user to the reaction
     * - if the user already reacted to the blog, remove the user from the reaction
     * - if the user is the only one who reacted to the reaction, remove the reaction (after that user reacts)
     * - if the user was reacting on other reaction, remove the user from the reaction and add the user to the new reaction
     */

    // prevent spamming
    if (Reaction.buttonSleeping) {
      Debug.log({
        message: '😴 Button is sleeping',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }

    const user = useCurrentUser(); // main user
    const blogExist =
      Generics.getObjectInfoSeparate(blog)?.values?.includes(undefined) ||
      !Generics.getObjectInfoSeparate(blog)?.values?.length;
    const reactionExist =
      Generics.getObjectInfoSeparate(reaction)?.values?.includes(undefined) ||
      !Generics.getObjectInfoSeparate(reaction)?.values?.length;

    if (!user) {
      Debug.error({
        message: '😐User is not logged in',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }
    if (blogExist || reactionExist) {
      Debug.error({
        message: '🚨 Error getting object info',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }

    try {
      const blogClone: Partial<Blog> = JSON.parse(JSON.stringify(blog));
      const blogReactionsClone: BlogReaction[] = JSON.parse(JSON.stringify(blogClone.reactions));
      const currentUser = useCurrentUser();
      const removeReaction = (reaction: BlogReaction) => {
        blogClone.reactions = blogClone.reactions?.filter((rect) => rect.key !== reaction.key);
      };
      const clearBlogUser = (reaction: BlogReaction) => {
        reaction.users = reaction.users?.filter(
          (user: FirestoreUser) => user.uid !== currentUser.value?.uid
        );
      };
      const usr: FirestoreUser = {
        // firestore user
        uid: currentUser.value?.uid!,
        displayName: currentUser.value?.displayName!,
        email: currentUser.value?.email!,
        photoURL: currentUser.value?.photoURL!,
      };

      const handleReaction = () => {
        const reactionExist: boolean = !!blogReactionsClone?.find(
          (rect) => rect.key === reaction.key
        );
        const userAlreadyReacted: boolean = !!blogReactionsClone?.find((rect) => {
          return !!rect.users?.find((user: FirestoreUser) => {
            return user?.uid === currentUser.value?.uid;
          });
        });

        if (reactionExist) {
          console.log('🙌🏻 reaction exists');

          blogClone.reactions = blog.reactions?.map((rect) => {
            console.log('🎢');
            clearBlogUser(rect);

            // looped on the origin data to make sure that the data is up to date always
            const targetReaction = blogReactionsClone?.find((rect) => rect.key === reaction.key);
            console.log('🎢', targetReaction);

            if (targetReaction) {
              rect.users = [...targetReaction.users!, usr];
            }

            return rect;
          });
        } else {
          blogClone.reactions?.push({
            ...reaction,
            users: [usr],
          });
        }
      };

      const checkAndUpdateReaction = () => {
        handleReaction();

        for (const r of blog.reactions!) {
          if (!r.users?.length) {
            removeReaction(r);
          }
        }
      };
      if (!blogReactionsClone) {
        blogClone.reactions = [];
      }
      //
      //       const oldRec = blogReactionsClone?.find(
      //         (rect) => !!rect.users?.find((user: FirestoreUser) => user.uid === currentUser.value?.uid)
      //       );

      checkAndUpdateReaction();

      await BlogHandler.update(blogClone);
      await Reaction.sleep();
    } catch (error) {
      Debug.error({
        message: '🚨 Error reacting to blog',
        source: 'utils/generics.ts',
        data: { blog, reaction },
        useOnProduction: true,
      });
    }
  }
}
