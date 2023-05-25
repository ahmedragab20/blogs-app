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

  return {
    activeLayout,
    setActiveLayout,
  };
});
