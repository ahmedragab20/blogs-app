<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4">
      <div>
        <UButton label="Open" @click="isOpen = true" />

        <USlideover v-model="isOpen">
          <div class="h-screen overflow-y-auto">
            <pre>
              {{ appConfig }}
            </pre>
          </div>
        </USlideover>
      </div>
      <div>
        {{ dropdown || 'Nothing selected' }}
        <UDropdown :items="colors">
          <UButton
            color="white"
            label="Options"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
      </div>
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
          iconClass: `!text-${i}-500`,
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

  const presetItem = computed(() => {
    return `"item": {
    "base": "group flex items-center gap-2 w-full",
    "rounded": "rounded-md",
    "padding": "px-2 py-1.5",
    "size": "text-sm",
    "active": "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white",
    "inactive": "text-gray-700 dark:text-gray-200",
    "disabled": "cursor-not-allowed opacity-50",
    "icon": {
      "base": "flex-shrink-0 h-4 w-4",
      "active": "text-red-500 dark:text-red-400",
      "inactive": "text-red-400 dark:text-red-500"
    },
    "avatar": {
      "base": "flex-shrink-0",
      "size": "3xs"
    },
    "shortcuts": "hidden md:inline-flex flex-shrink-0 gap-0.5 ml-auto"
  }`;
  });
</script>
