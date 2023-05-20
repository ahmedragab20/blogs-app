<template>
  <div v-if="loaded" id="ragab-app">
    <NuxtLayout :name="layout"></NuxtLayout>
  </div>
</template>
<script setup lang="ts">
  const layout = 'default';
  const appConfig = useAppConfig();
  const colorMode = useColorMode();
  const loaded = ref(false);

  const initTheme = () => {
    if (process.client) {
      const appSettings = localStorage.getItem('appSettings');
      if (!!appSettings) {
        const settings = JSON.parse(appSettings);
        appConfig.ui.primary = settings.color?.primary || 'green';
        appConfig.ui.gray = settings.color?.secondary || 'cool';
      }
    }
  };

  onMounted(() => {
    initTheme();
    loaded.value = true; // ui is loaded!
  });

  watch(colorMode, () => {
    console.log('color mode changed');
    initTheme();
  });

  /**
   * TODO::
   *
   * // 1. Check if there is a changes have been made before saving the new settings
   * // 2. fix 'nuxt-color-mode' in the local storage
   * 3. add shortcut to toggle the settings modal
   */
</script>
