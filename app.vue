<template>
  <NuxtLayout :name="layout">
    <!-- The Wrapper of the pages -->
    <div class="dark:bg-stone-950 bg-slate-100 transition-all duration-300">
      <!-- header -->
      <BaseHeader />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
  const layout = 'default'; // you can remove it as long as you named it default
</script>
