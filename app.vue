<template>
  <div v-if="loaded" id="ragab-app" :class="{ 'pb-[250px]': !user }">
    <!-- 🚧 - App Layouts -->
    <NuxtLayout :name="layout"></NuxtLayout>

    <!-- Footer -->
    <div class="py-10 px-4 flex justify-center items-center">
      Made with ❤️ by
      <a href="https://github.com/ahmedragab20" target="_blank" class="text-primary-500 mx-1">
        Ragab
      </a>
      <small class="text-gray-400 dark:text-gray-500">&copy; 2023</small>
    </div>

    <!-- 🤷🏻‍♂️ - so global -->

    <!-- Toasts -->
    <UNotifications />
    <!-- Auth Land -->
    <template v-if="!user">
      <UModal v-model="authStore.authLanded">
        <AuthLand :target="chosenAuthLand" />
      </UModal>
      <!-- Auth Banner -->
      <AuthBanner ref="auth-banner" @select-type="chooseAuthLand" />
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
  const chooseAuthLand = (land: AuthLand) => {
    authStore.chooseAuthLand(land);
    authStore.toggleAuthLanded(true);
  };
  const authBanner = ref<HTMLElement>();

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

  const initAppBase = () => {
    const appBase = useAppBase();

    appBase?.();
  };

  onMounted(async () => {
    initTheme();

    const getUser = await getCurrentUser().finally(() => {
      loaded.value = true;
    });
  });

  watchEffect(() => {
    if (!generalStore.blogTags?.length || !generalStore.blogReactions?.length) {
      //TODO:: investigate more in the root of this issue
      initAppBase();
    }
  });

  /**
   * TODOs [globally]]:
   * TODO:: add ZOD to the app
   * TODO:: table for the shortcuts
   * TODO:: add gsap + scrolltrigger + animation.css
   */
</script>
