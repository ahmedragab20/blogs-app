export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(`%cauth middleware`, 'color: #0f0; font-size: 1.2rem');

  const user = await getCurrentUser();

  if (!user) {
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
