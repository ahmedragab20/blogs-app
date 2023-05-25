<template>
  <div id="ragab-app">
    <!-- 🚧 - App Layouts -->
    <NuxtLayout v-if="loaded" :name="layout"></NuxtLayout>

    <!-- 🤷🏻‍♂️ - so global -->

    <!-- Toasts -->
    <UNotifications />
    <!-- Auth Land -->
    <UModal v-model="authStore.authLanded">
      <AuthLand :target="chosenAuthLand" />
    </UModal>
    <!-- Auth Banner -->
    <AuthBanner @select-type="chooseAuthLand" />
  </div>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';
  import { useGeneralStore } from '~/stores/general';
  type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify'; //TODO:: search why it fails to be imported if you added it in types/index.ts

  const generalStore = useGeneralStore();
  const authStore = useAuthStore();
  const layout = computed(() => generalStore.activeLayout);
  const appConfig = useAppConfig();
  const appSettings = ref();
  const loaded = ref(false);
  const chosenAuthLand = computed<AuthLand>(() => authStore.chosenAuthLand); // fallback to login
  const setAuthLand = (land: AuthLand): void => authStore.chooseAuthLand(land);
  const chooseAuthLand = (land: AuthLand) => {
    setAuthLand(land);
    authStore.toggleAuthLanded(true);
  };

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

    // if AuthBanner is shown, take the height of it add add it as bottom padding to the body
    const authBanner = document.querySelector('.auth-banner');
    if (authBanner) {
      const authBannerHeight = authBanner.clientHeight;
      document.body.style.paddingBottom = `${authBannerHeight}px`;
    }
  });

  /**
   * TODOs [globally]]:
   * TODO:: add ZOD to the app
   * TODO:: add gsap + scrolltrigger + animation.css
   */
</script>
