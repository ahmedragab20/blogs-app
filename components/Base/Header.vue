<template>
  <div
    class="flex justify-between w-full min-h-[8vh] border-b border-slate-900 dark:border-slate-100"
  >
    <!-- switcher -->
    <div
      class="w-[15%] min-h-full flex justify-center items-center px-1 py-1 sm:px-4 border-r dark:border-slate-100 border-slate-900"
    >
      <AppThemeSwitcher
        class="flex items-center justify-center w-10 h-10 rounded-full shadow-sm sm:w-9 sm:h-9 dark:bg-slate-800 bg-slate-300"
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
</template>
<script setup lang="ts">
  const props = defineProps<{
    menuToggler: () => void;
  }>();
</script>
