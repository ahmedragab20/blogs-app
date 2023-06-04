<template>
  <UCard
    class="flex items-center justify-center duration-300 bg-transparent border rounded-lg shadow-xl cursor-pointer select-none hover:bg-primary-50 shadow-transparent hover:shadow-primary-200 dark:hover:shadow-primary-950 border-base-color"
  >
    <div class="flex justify-center items-center flex-wrap">
      <div v-for="rc in reactions" :key="rc.key" class="w-7 h-7 flex justify-center items-center">
        <img :src="rc.icon" alt="icon for reaction" class="w-full h-full object-contain" />
      </div>
    </div>
    <div class="text-center">
      <h2 class="text-2xl font-bold text-primary-500 font-headline">Add a new blog</h2>
      <p class="text-base-color text-preset">let's add a blog and show us your creativity👀</p>
      <div class="mt-4 hidden md:block">
        <small class="flex items-center justify-center gap-1 text-preset">
          Press
          <kbd class="px-1 text-xs text-white bg-primary-500 rounded">N</kbd> to add new blog
        </small>
      </div>
    </div>
  </UCard>
</template>
<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  const generalStore = useGeneralStore();
  const reactions = computed(() => generalStore.blogReactions);
</script>
