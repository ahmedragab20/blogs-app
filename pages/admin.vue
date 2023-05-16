<template>
  <div>
    <h1>Admin</h1>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });
</script>
