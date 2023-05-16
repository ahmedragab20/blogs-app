<template>
  <div @click="toggleTheme" class="cursor-pointer">
    <div class="flex justify-center items-center">
      <Icon :name="themeIcon?.icon || ''" :color="themeIcon?.color" :size="themeIcon?.size" />
    </div>
  </div>
</template>
<script setup lang="ts">
  interface Icon {
    icon: string;
    color: string;
    size: string;
  }

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

  const themeIcon = computed<Icon | undefined>(() => {
    if (colorMode.preference === 'light') {
      return {
        icon: 'solar:sun-fog-broken',
        color: 'white',
        size: '1.2rem',
      };
    } else if (colorMode.preference === 'dark') {
      return {
        icon: 'solar:moon-fog-broken',
        color: 'white',
        size: '1.2rem',
      };
    } else if (colorMode.preference === 'sepia') {
      return {
        icon: 'solar:waterdrop-broken',
        color: 'black',
        size: '1.2rem',
      };
    }
  });
</script>
