import { collection } from 'firebase/firestore';
import { useGeneralStore } from '~/stores/general';
import { Tag } from '~/types';
export default defineNuxtPlugin(() => {
  const db = useFirestore();
  const generalStore = useGeneralStore();

  const tagsCollection = useCollection(collection(db, 'tags')).value as Tag[];

  Debug.log({
    message: '🎉Tags collection fetched🎉',
    data: tagsCollection,
    source: 'plugins/startup-calls.ts',
    useOnProduction: true,
  });

  generalStore.setBlogTags(tagsCollection);
});
