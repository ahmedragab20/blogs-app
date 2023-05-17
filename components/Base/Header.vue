<template>
  <div
    class="flex justify-between w-full min-h-[8vh] border-b border-slate-900 dark:border-slate-100"
  >
    <!-- switcher -->
    <div
      class="w-[15%] min-h-full flex justify-center items-center px-1 py-1 sm:px-4 border-r dark:border-slate-100 border-slate-900"
    >
      <AppThemeSwitcher
        class="w-10 sm:w-9 h-10 sm:h-9 flex justify-center items-center rounded-full dark:bg-slate-800 bg-slate-300 shadow-sm"
      />
    </div>
    <!-- Logo -->
    <div class="w-[70%] flex justify-center items-center py-1">
      <NuxtLink to="/" class="text-2xl font-bold text-slate-900 font-headline dark:text-slate-100">
        <span class="text-slate-500 dark:text-slate-400">AR</span>
        <span class="text-slate-900 dark:text-slate-100">Blogs</span>
      </NuxtLink>
    </div>
    <!-- menu -->
    <div
      class="w-[15%] flex justify-center items-center min-h-full py-1 px-1 sm:px-4 border-l dark:border-slate-100 border-slate-900"
    >
      <Icon
        @click="menuToggler()"
        class="cursor-pointer"
        name="solar:hamburger-menu-linear"
        size="2rem"
        :class="$colorMode.preference === 'dark' ? 'text-slate-100' : 'text-slate-950'"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    menuToggler: () => void;
  }>();
</script>
