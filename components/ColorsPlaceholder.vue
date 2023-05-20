<template>
  <div class="initial:p-1">
    <!-- header -->
    <div class="p-1 rounded-full initial:bg-primary-500" :class="primaryBg"></div>
    <!-- body -->
    <div class="p-1 rounded-full initial:bg-gray-500 w-10/12 my-1" :class="secondaryBg"></div>
    <div class="p-1 rounded-full initial:bg-gray-500 w-3/4" :class="secondaryBg"></div>
    <div class="p-1 rounded-full initial:bg-gray-500 w-5/6 my-1" :class="secondaryBg"></div>
    <!-- footer -->
    <div class="p-1 rounded-full w-1/4 my-1 initial:bg-primary-500" :class="primaryBg"></div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    primaryBg?: string;
    secondaryBg?: string;
  }>();
</script>
