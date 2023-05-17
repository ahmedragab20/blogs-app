<template>
  <!-- The Wrapper of the pages -->
  <div class="dark:bg-stone-950 bg-slate-100 transition-all ease-linear duration-700">
    <!-- header -->
    <div class="fixed top-0 w-full left-0">
      <BaseHeader :menu-toggler="toggleLinksSection" />
      <Transition name="slide-fade">
        <template v-if="linksSection">
          <BaseLinks class="-mt-1" />
        </template>
      </Transition>
    </div>
    <!-- content -->
    <div
      class="md:w-[70%] sm:w-11/12 w-full sm:border-x dark:border-slate-600 border-stone-950 px-3 mx-auto pt-[10vh]"
    >
      <NuxtPage />
    </div>
  </div>
</template>
<script setup lang="ts">
  const linksSection = ref(false);
  const toggleLinksSection = () => {
    linksSection.value = !linksSection.value;
  };
</script>
