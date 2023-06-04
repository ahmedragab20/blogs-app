import { Blog, BlogReaction, FirestoreUser, ReactionReturn } from '~/types';
interface ReactionOptions {
  getUsers?: boolean;
  count?: boolean;
  getReactions?: boolean;
  [key: string]: boolean | undefined;
}

export default class Reaction {
  private static isReacting = false;
  protected static reactionCount = 0;
  protected static reactionUsers: FirestoreUser[] = [];
  protected static theReturn = {} as ReactionReturn;

  static async react(
    blogId: string,
    reaction: BlogReaction,
    options?: Partial<ReactionOptions>
  ): Promise<void | Partial<ReactionReturn>> {
    /**
     * Scenario:: the user will add reaction to the blog
     * - wait until the function fully executes if it was still executing
     * - if that reaction already exists, add the user to the reaction
     * - if that reaction does not exist, create a new reaction and add the user to the reaction
     * - if the user already reacted to the blog, remove the user from the reaction
     * - if the user is the only one who reacted to the reaction, remove the reaction (after that user reacts)
     * - if the user was reacting on other reaction, remove the user from the reaction and add the user to the new reaction
     */
    if (Reaction.isReacting) {
      // Function is already running, ignore the current call
      return;
    }

    const blog = (await BlogHandler.get(blogId)) as Blog;
    /**
     * I have notes about this pattern.
     *
     * This pattern is unlikely to work with a normal DB.
     * Additionally, it's not recommended to use this approach in an app
     * that might have a large number of active users simultaneously.
     *
     * The main problem is that we have to query the DB with each click,
     * which can be inefficient and slow down the app.
     *
     * However, if we're using Firestore (a document DB) and have a small number of users,
     * it's acceptable to use this approach to ensure we always get the latest DB results.
     */

    const user = useCurrentUser(); // main user
    if (!user) {
      Debug.error({
        message: '😐User is not logged in',
        source: 'utils/generics.ts',
        useOnProduction: true,
      });
      return;
    }
    if (!blog || !reaction) {
      Debug.error({
        message: '🚨 Error getting object info',
        source: 'utils/generics.ts',
        data: { blog, reaction },
        useOnProduction: true,
      });
      return;
    }

    try {
      Reaction.isReacting = true;
      const currentUser = useCurrentUser();
      const usr: FirestoreUser = {
        uid: currentUser.value?.uid!,
        displayName: currentUser.value?.displayName!,
        email: currentUser.value?.email!,
        photoURL: currentUser.value?.photoURL!,
      };

      const reactionExist = blog.reactions?.some((rect) => rect.key === reaction.key);

      const removeReaction = (reaction: BlogReaction) => {
        blog.reactions = blog.reactions?.filter((rect) => rect.key !== reaction.key);
      };

      const clearBlogUser = (reaction: BlogReaction) => {
        reaction.users = reaction.users?.filter(
          (user: FirestoreUser) => user.uid !== currentUser.value?.uid
        );
      };

      const addUserToReaction = (reaction: BlogReaction) => {
        reaction.users = [
          ...reaction.users,
          {
            createdAt: new Date(),
            reactionKey: reaction.key,
            ...usr,
          },
        ];
      };

      const handleReaction = () => {
        if (reactionExist) {
          blog.reactions = blog.reactions?.map((rect) => {
            if (rect.key === reaction.key) {
              const alreadyReacted = rect.users?.some(
                (user: FirestoreUser) => user?.uid === currentUser.value?.uid
              );

              if (alreadyReacted) {
                clearBlogUser(rect);
              } else {
                addUserToReaction(rect);
              }
            } else {
              clearBlogUser(rect);
            }
            return rect;
          });
        } else {
          blog.reactions?.forEach(clearBlogUser);
          blog.reactions?.push({
            ...reaction,
            users: [
              {
                createdAt: new Date(),
                reactionKey: reaction.key,
                ...usr,
              },
            ],
          });
        }
      };

      const checkAndUpdateReaction = () => {
        handleReaction();
        blog.reactions?.forEach((r) => {
          if (!r.users?.length) {
            removeReaction(r);
          }
        });
      };

      checkAndUpdateReaction();

      await BlogHandler.update(blog);

      if (options?.['getUsers']) {
        const allUsersSet = new Set<FirestoreUser>();
        blog.reactions?.forEach((r) => r.users?.forEach((u) => allUsersSet.add(u)));

        Reaction.reactionUsers = Array.from(allUsersSet);
        Reaction.theReturn['users'] = Reaction.reactionUsers;
      }

      if (options?.count) {
        let count = 0;
        blog.reactions.forEach((r) => {
          count += r.users?.length!;
        });
        Reaction.reactionCount = count;
        Reaction.theReturn['count'] = Reaction.reactionCount;
      }

      if (options?.getReactions) {
        Reaction.theReturn['reactions'] = blog.reactions;
      }

      return Reaction.theReturn;
    } catch (error) {
      Debug.error({
        message: '🚨 Error reacting to blog',
        source: 'utils/generics.ts',
        data: { blog, reaction, error },
        useOnProduction: true,
      });
    } finally {
      setTimeout(() => {
        Reaction.isReacting = false;
      }, 1000);
    }
  }
}
