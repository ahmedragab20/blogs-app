<template>
  <div
    class="flex justify-between w-full min-h-[8vh] border-b border-slate-900 dark:border-slate-100"
  >
    <!-- switcher -->
    <div
      class="w-[15%] min-h-full flex justify-center items-center px-1 py-1 sm:px-4 border-r dark:border-slate-100 border-slate-900"
    >
      <UButton
        @click="settingsToggler"
        icon="i-heroicons-wrench"
        variant="soft"
        :ui="presetButton"
      />
    </div>
    <!-- Logo -->
    <div class="w-[70%] flex justify-center items-center py-1">
      <NuxtLink to="/" class="text-2xl text-slate-900 dark:text-slate-100">
        <span class="text-primary-300">AR</span>
        <span class="text-primary">Blogs</span>
      </NuxtLink>
    </div>
    <!-- menu -->
    <div
      class="w-[15%] flex justify-center items-center min-h-full py-1 px-1 sm:px-4 border-l dark:border-slate-100 border-slate-900"
    >
      =
    </div>
  </div>

  <!-- settings modal -->
  <UModal v-model="settingsModal">
    <BaseSettings @close="onSettingsClose" />
  </UModal>
</template>
<script setup lang="ts">
  const props = defineProps<{
    menuToggler: () => void;
  }>();
  const toast = useToast();

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
</script>
