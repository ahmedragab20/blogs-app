<template>
  <!-- The Wrapper of the pages -->
  <div>
    <!-- header -->
    <div class="fixed top-0 w-full left-0">
      <BaseHeader :menu-toggler="toggleLinksSection" />
    </div>
    <!-- content -->
    <div class="md:w-[70%] sm:w-11/12 w-full px-3 mx-auto pt-[10vh]">
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
