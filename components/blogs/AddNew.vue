<template>
  <UCard
    class="flex items-center justify-center duration-300 bg-transparent border rounded-lg shadow-xl cursor-pointer select-none hover:bg-primary-50 shadow-transparent hover:shadow-primary-200 dark:hover:shadow-primary-950 border-base-color"
  >
    <div class="text-center">
      <UIcon name="i-heroicons-cursor-arrow-ripple" class="text-5xl text-primary-500" />
    </div>
    <div class="text-center">
      <h2 class="text-2xl font-bold text-primary-500 font-headline">Add new blog</h2>
      <p class="text-base-color text-preset">Add new blog to your blog list</p>
      <div class="mt-4 hidden md:block">
        <small class="flex items-center justify-center gap-1 text-preset">
          Press
          <kbd class="px-1 text-xs text-white bg-primary-500 rounded">N</kbd> to add new blog
        </small>
      </div>
    </div>
  </UCard>
</template>
