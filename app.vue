<template>
  <div id="ragab-app">
    <div class="flex justify-center">
      <div class="mt-20 bg-primary-100 text-primary-500 p-1 shadow-sm rounded-md">
        {{ authDomain }}
      </div>
    </div>
    <NuxtLayout v-if="loaded" :name="layout"></NuxtLayout>

    <!-- 🤷🏻‍♂️ - so global -->

    <!-- Toasts -->
    <UNotifications />
    <!-- Auth Land -->
    <UModal v-model="generalStore.authLanded">
      <AuthLand :target="chosenAuthLand" />
    </UModal>
    <!-- Auth Banner -->
    <AuthBanner @select-type="chooseAuthLand" />
  </div>
</template>
<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify'; //TODO:: search why it fails to be imported if you added it in types/index.ts

  const authDomain = computed(() => import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

  const generalStore = useGeneralStore();
  const layout = 'default';
  const appConfig = useAppConfig();
  const appSettings = ref();
  const loaded = ref(false);
  const chosenAuthLand = ref<AuthLand>('login'); // fallback to login
  const chooseAuthLand = (land: AuthLand): void => {
    if (!land) return;

    chosenAuthLand.value = land;
    generalStore.toggleAuthLanded(true);
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
</script>
