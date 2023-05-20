<template>
  <div id="ragab-app">
    <NuxtLayout v-if="loaded" :name="layout"></NuxtLayout>

    <!-- 🤷🏻‍♂️ - so global -->
    <UNotifications />
  </div>
</template>
<script setup lang="ts">
  const layout = 'default';
  const appConfig = useAppConfig();
  const appSettings = ref();
  const loaded = ref(false);

  const initTheme = () => {
    if (process.client) {
      appSettings.value = localStorage.getItem('appSettings');
      if (!!appSettings.value) {
        const settings = JSON.parse(appSettings.value);

        appConfig.ui.primary = settings.color?.primary || 'green';
        appConfig.ui.gray = settings.color?.secondary || 'cool';
      }
    }
  };

  onMounted(() => {
    initTheme();

    loaded.value = true; // ui is loaded!
  });
  /**
   * TODO::
   *
   * // 1. Check if there is a changes have been made before saving the new settings
   * // 2. fix 'nuxt-color-mode' in the local storage
   * 3. add shortcut to toggle the settings modal
   */
</script>
