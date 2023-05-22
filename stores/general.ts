export const useGeneralStore = defineStore('general', () => {
  const authLanded = ref<boolean>(false);
  const toggleAuthLanded = (payload?: boolean) => {
    if (payload && [true, false].includes(payload)) {
      authLanded.value = payload;
      return;
    }

    authLanded.value = !authLanded.value;
  };

  return {
    authLanded,
    toggleAuthLanded,
  };
});
