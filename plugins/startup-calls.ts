import { collection } from 'firebase/firestore';
import { useGeneralStore } from '~/stores/general';
import { Tag } from '~/types';
export default defineNuxtPlugin((nuxtApp) => {
  const db = useFirestore();
  const generalStore = useGeneralStore();

  const cafeCollection = useCollection(collection(db, 'tags')).value as Tag[];
  generalStore.setBlogTags(cafeCollection);
});
