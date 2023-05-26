<template>
  <div class="flex justify-between w-full min-h-[8vh] backdrop-blur-md px-1 sm:px-0">
    <!-- switcher -->
    <div class="sm:w-[15%] min-h-full flex justify-center items-center px-1 py-1 sm:px-1">
      <UTooltip class="hidden sm:flex" text="app settings" :shortcuts="[metaSymbol, '.']">
        <UButton
          @click="settingsToggler"
          icon="i-heroicons-wrench"
          variant="soft"
          :ui="presetButton"
        />
      </UTooltip>
      <div class="flex sm:hidden">
        <UButton
          @click="settingsToggler"
          icon="i-heroicons-wrench"
          variant="soft"
          :ui="presetButton"
        />
      </div>
    </div>
    <!-- Logo -->
    <div class="sm:w-[70%] flex justify-center items-center py-1">
      <NuxtLink to="/" class="text-2xl font-headline">
        <span class="text-primary-500">AR</span>
        <span class="text-gray-800 dark:text-gray-300">Blogs</span>
      </NuxtLink>
    </div>
    <!-- menu -->
    <div class="sm:w-[15%] flex justify-center items-center min-h-full py-1 px-1 sm:px-4">
      <template v-if="!!user">
        <BaseLinks />
      </template>
      <template v-else>
        <div>
          <UTooltip class="hidden sm:flex" text="Login" :shortcuts="['l']">
            <UButton @click="openLoginDialog" icon="i-heroicons-lock-closed" variant="soft">
              LOGIN
            </UButton>
          </UTooltip>
          <div class="flex sm:hidden">
            <UButton @click="openLoginDialog" icon="i-heroicons-lock-closed" variant="soft">
              LOGIN
            </UButton>
          </div>
        </div>
      </template>
    </div>
  </div>
  <!-- settings modal -->
  <UModal v-model="settingsModal" name="settingsModal">
    <BaseSettings @close="onSettingsClose" />
  </UModal>
</template>
<script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';
  const authStore = useAuthStore();

  const { metaSymbol } = useShortcuts();
  const toast = useToast();
  const user = useCurrentUser();

  const presetButton = {
    rounded: 'rounded-full',
  };

  const settingsModal = ref(false);

  const settingsToggler = () => {
    settingsModal.value = !settingsModal.value;
  };

  const onSettingsClose = (haveDataChanged?: boolean) => {
    settingsModal.value = false;

    if (haveDataChanged) toast.add({ title: `your settings have been saved correctly` });
  };

  const openLoginDialog = (): void => {
    authStore.chooseAuthLand('login');
    authStore.toggleAuthLanded(true);
  };

  defineShortcuts({
    'meta_.': {
      usingInput: false,
      handler: () => settingsToggler(),
    },
  });

  defineShortcuts({
    L: {
      usingInput: false,
      handler: () => openLoginDialog(),
    },
  });
</script>
