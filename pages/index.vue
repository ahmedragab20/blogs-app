<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4 border-x">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis, unde blanditiis. Quam
      voluptates eum labore expedita cum rem architecto, vero eos perspiciatis odio. Blanditiis
      consectetur ipsum commodi corrupti assumenda nobis.
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
