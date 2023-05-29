import { useGeneralStore } from '@/stores/general';
import { collection } from 'firebase/firestore';

export default function () {
  return function getAppBase() {
    const db = useFirestore();
    const generalStore = useGeneralStore();
    const tagsCollection = useCollection(collection(db, 'tags'));

    Debug.log({
      message: '🎉Tags collection fetched🎉',
      data: tagsCollection,
      source: 'plugins/startup-calls.ts',
      useOnProduction: true,
    });

    //@ts-ignore
    generalStore.setBlogTags(tagsCollection.value || tagsCollection);

    const reactionsCollection = useCollection(collection(db, 'reactions'));
    //@ts-ignore
    generalStore.setBlogReactions(reactionsCollection.value || tagsCollection);
  };
}
