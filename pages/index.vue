<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4 border-x">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim veritatis assumenda cumque,
      eaque eum itaque repellat nobis repellendus animi, architecto maxime quae soluta odit autem
      necessitatibus, repudiandae facere commodi unde?
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  const isOpen = ref(false);
  const appConfig = useAppConfig();

  const colors = computed(() => {
    return appConfig.ui.colors.map((i: string) => {
      return [
        {
          label: i,
          icon: 'i-heroicons-moon',
          iconClass: `text-${i}-500`,
          click: () => {
            dropdown.value = i;
          },
        },
      ];
    });
  });

  const dropdown = ref();

  watch(
    () => dropdown.value,
    (value) => {
      appConfig.ui.primary = value;
    }
  );
</script>
