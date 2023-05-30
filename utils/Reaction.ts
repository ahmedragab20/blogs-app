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

    Debug.log({
      message: '👍 Reaction button clicked',
      data: { blog, reaction },
    });

    // prevent spamming
    if (Reaction.buttonSleeping) {
      Debug.log({
        message: '😴 Button is sleeping',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }

    const user = useCurrentUser();
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
      const currentUser = useCurrentUser();
      const checkAndUpdateReaction = (oldReaction: Reaction) => {};
      if (!blogClone.reactions) {
        blogClone.reactions = [];
      }

      const oldRec = blogClone.reactions?.find(
        (rect) => !!rect.users?.find((user: FirestoreUser) => user.uid === currentUser.value?.uid)
      );

      if (oldRec) {
        blogClone.reactions = blogClone.reactions?.map((rect) => {
          if (rect.key === rect.key) {
            rect.users = rect.users?.filter(
              (user: FirestoreUser) => user.uid !== currentUser.value?.uid
            );
          }
          return rect;
        });

        if (!reaction.users?.length) {
          blogClone.reactions = blogClone.reactions?.filter((rect) => rect.key !== reaction.key);
        }

        if (oldRec.key !== reaction.key) {
          const usr: FirestoreUser = {
            uid: currentUser.value?.uid!,
            displayName: currentUser.value?.displayName!,
            email: currentUser.value?.email!,
            photoURL: currentUser.value?.photoURL!,
          };

          // check if reaction already exists
          const reactionExist = blogClone.reactions?.find((rect) => rect.key === reaction.key);

          if (reactionExist) {
            blogClone.reactions = blogClone.reactions?.map((rect) => {
              if (rect.key === reaction.key) {
                rect.users = [...rect.users, usr];
              }
              return rect;
            });
          } else {
            blogClone.reactions?.push({
              ...reaction,
              users: [usr],
            });
          }
        }
      } else {
        const usr: FirestoreUser = {
          uid: currentUser.value?.uid!,
          displayName: currentUser.value?.displayName!,
          email: currentUser.value?.email!,
          photoURL: currentUser.value?.photoURL!,
        };

        // check if reaction already exists
        const reactionExist = blogClone.reactions?.find((rect) => rect.key === reaction.key);

        if (reactionExist) {
          blogClone.reactions = blogClone.reactions?.map((rect) => {
            if (rect.key === reaction.key) {
              rect.users = [...rect.users, usr];
            }
            return rect;
          });
        } else {
          blogClone.reactions?.push({
            ...reaction,
            users: [usr],
          });
        }
      }

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
