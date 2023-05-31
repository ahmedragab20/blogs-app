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
     * Scenario:: the user will add reaction to the blog
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
    const blogNotExist =
      Generics.getObjectInfoSeparate(blog)?.values?.includes(undefined) ||
      !Generics.getObjectInfoSeparate(blog)?.values?.length;

    if (!user) {
      Debug.error({
        message: '😐User is not logged in',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }
    if (blogNotExist || !reaction) {
      Debug.error({
        message: '🚨 Error getting object info',
        source: 'utils/generics.ts',
        data: {
          blog,
          reaction,
        },
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
        console.log({
          blogReactions: blog.reactions,
          blogClone,
          blogReactionsClone,
          reaction,
          currentUser,
        });

        function reactionExists(blog: Partial<Blog>, reaction: BlogReaction): boolean {
          if (!blog || !blog.reactions || !reaction) {
            return false;
          }

          const reactionExist = blog.reactions.some((rect) => rect.key === reaction.key);
          return reactionExist;
        }

        if (reactionExists(blog, reaction)) {
          blogClone.reactions = blog.reactions?.map((rect) => {
            // looped on the origin data to make sure that the data is up to date always
            if (rect.key === reaction.key) {
              const alreadyReacted = !!rect.users?.find((user: FirestoreUser) => {
                return user?.uid === currentUser.value?.uid;
              });

              if (alreadyReacted) {
                clearBlogUser(rect);
              } else {
                rect.users = [...rect.users, usr];
              }
            } else {
              clearBlogUser(rect);
            }
            return rect;
          });

          return;
        } else {
          console.log('reaction does not exist 🤌🏻', {
            blog,
            reaction,
          });
          // RECHECK AGAIN
          if (reactionExists(blog, reaction)) {
            Debug.error({
              message: '🚨 I`s WRONG!!',
              source: 'utils/generics.ts',
              data: { blog, reaction },
              useOnProduction: true,
            });
          }

          blogClone.reactions?.push({
            ...reaction,
            createdAt: new Date(),
            users: [usr],
          });

          for (const blogR of blogClone.reactions!) {
            if (blogR.key !== reaction.key) {
              clearBlogUser(blogR);
            }
          }
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

      checkAndUpdateReaction();

      await BlogHandler.update(blogClone);
      await Reaction.sleep();
    } catch (error) {
      Debug.error({
        message: '🚨 Error reacting to blog',
        source: 'utils/generics.ts',
        data: { blog, reaction, error },
        useOnProduction: true,
      });
    }
  }
}
