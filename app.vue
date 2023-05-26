<template>
  <div v-if="loaded" id="ragab-app">
    <!-- 🚧 - App Layouts -->
    <NuxtLayout :name="layout"></NuxtLayout>

    <!-- 🤷🏻‍♂️ - so global -->

    <!-- Toasts -->
    <UNotifications />
    <!-- Auth Land -->
    <template v-if="!user">
      <UModal v-model="authStore.authLanded">
        <AuthLand :target="chosenAuthLand" />
      </UModal>
      <!-- Auth Banner -->
      <AuthBanner @select-type="chooseAuthLand" />
    </template>
  </div>
  <div v-else class="flex justify-center items-center flex-col h-screen gap-4">
    <div v-for="n in 4" :key="n">
      <div class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12 rounded-full" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';
  import { useGeneralStore } from '~/stores/general';
  type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify'; //TODO:: search why it fails to be imported if you added it in types/index.ts
  const user = useCurrentUser();
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

  onMounted(async () => {
    initTheme();

    // if AuthBanner is shown, take the height of it add add it as bottom padding to the body
    const authBanner = document.querySelector('.auth-banner');
    if (authBanner) {
      const authBannerHeight = authBanner.clientHeight;
      document.body.style.paddingBottom = `${authBannerHeight}px`;
    }

    const getUser = await getCurrentUser().finally(() => {
      loaded.value = true;
    });
  });

  /**
   * TODOs [globally]]:
   * TODO:: add ZOD to the app
   * TODO:: table for the shortcuts
   * TODO:: add gsap + scrolltrigger + animation.css
   */
</script>
