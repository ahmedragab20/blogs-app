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

  const avatars = computed(() => [
    'https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-6299533-5187865.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/student-5796558-4841557.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/black-man-4975947-4159833.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-6299541-5187873.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/metal-girl-5681512-4729304.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/female-waiter-avatar-6299543-5187875.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/cadar-hijab-girl-5681511-4729303.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/hijab-girl-5681506-4729298.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/muslim-female-5229582-4385798.png',
  ]);

  return {
    activeLayout,
    setActiveLayout,
    avatars,
  };
});
