export const useGeneralStore = defineStore('general', () => {
  const activeLayout = ref<string>('default');

  const setActiveLayout = (layout: string) => {
    console.log('setActiveLayout: ', layout);

    if (!layout) {
      if (process.env.NODE_ENV === 'development') {
        throw createError({
          statusCode: 500,
          message: 'setActiveLayout: layout is required',
        });
      }

      return;
    }
    activeLayout.value = layout;
  };

  const authLanded = ref<boolean>(false);
  const toggleAuthLanded = (payload?: boolean) => {
    if (payload && [true, false].includes(payload)) {
      authLanded.value = payload;
      return;
    }

    authLanded.value = !authLanded.value;
  };

  return {
    activeLayout,
    setActiveLayout,
    authLanded,
    toggleAuthLanded,
  };
});
