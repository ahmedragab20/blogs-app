<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4 border-x">
      <AppConfirm
        class="max-w-[520px] bg-slate-100 rounded-lg"
        :submit="() => {}"
        :cancel="() => {}"
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi voluptas officiis voluptatem
        ducimus minus, dicta sit ipsum laudantium eos, error possimus! Quis quasi est nemo dolore
        numquam facere omnis dolor!
      </AppConfirm>
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
