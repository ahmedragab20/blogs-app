<template>
  <NuxtLayout :name="layout"></NuxtLayout>
</template>
<script setup lang="ts">
  const layout = 'default';
</script>
<style>
  html,
  body {
    @apply transition-all ease-linear duration-700 font-body;
  }
</style>
