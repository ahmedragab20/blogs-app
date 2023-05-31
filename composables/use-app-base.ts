import { useGeneralStore } from '@/stores/general';
import { collection } from 'firebase/firestore';

export default function () {
  return function getAppBase() {
    const db = useFirestore();
    const generalStore = useGeneralStore();
    const tagsCollection = useCollection(collection(db, 'tags'));

    //@ts-ignore
    generalStore.setBlogTags(tagsCollection.value || tagsCollection);

    const reactionsCollection = useCollection(collection(db, 'reactions'));
    //@ts-ignore
    generalStore.setBlogReactions(reactionsCollection.value || tagsCollection);
  };
}
