export default defineNuxtPlugin(() => {
  const getAppBase = useAppBase();

  if (process.client) {
    getAppBase();
  }
});
