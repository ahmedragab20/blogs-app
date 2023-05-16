<template>
  <div>
    <button @click="toggleTheme" class="text-2xl sm:text-3xl">{{ themeIcon }}</button>
  </div>
</template>
<script setup lang="ts">
  const colorMode = useColorMode();

  const toggleTheme = () => {
    if (colorMode.preference === 'light') {
      colorMode.preference = 'dark';
    } else if (colorMode.preference === 'dark') {
      colorMode.preference = 'sepia';
    } else if (colorMode.preference === 'sepia') {
      colorMode.preference = 'light';
    }
  };

  const themeIcon = computed(() => {
    if (colorMode.preference === 'light') {
      return '🌞';
    } else if (colorMode.preference === 'dark') {
      return '🌚';
    } else if (colorMode.preference === 'sepia') {
      return '🌾';
    }
  });
</script>
