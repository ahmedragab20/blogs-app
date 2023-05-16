<template>
  <NuxtLayout :name="layout">
    <!-- The Wrapper of the pages -->
    <div class="dark:bg-stone-950 bg-slate-100">
      <!-- header -->
      <div class="p-5">
        <div class="flex justify-end">
          <AppThemeSwitcher
            class="w-10 sm:w-9 h-10 sm:h-9 flex justify-center items-center rounded-full dark:bg-slate-800 bg-slate-300 shadow-sm"
          />
        </div>
      </div>
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
  //TODO: add icons module
  const layout = 'default'; // you can remove it as long as you named it default
</script>
