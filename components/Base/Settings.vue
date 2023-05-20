<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="text-2xl font-semibold text-primary-500">Settings</h3>
      </div>
    </template>

    <!-- body -->
    <div>
      <!-- colors -->
      <div>
        <!-- primary -->
        <div>
          <h5 class="mb-1 text-gray-500">Primary color</h5>
          <div class="flex w-full gap-2 px-1 py-2 overflow-x-auto">
            <div
              v-for="color in primaryColorsSorted"
              :key="color"
              class="min-w-[90px] cursor-pointer duration-300 hover:scale-105 max-w-[90px] max-h-[180px] m-1 rounded-md shadow-sm"
              :class="
                primaryColor === color
                  ? `ring ring-${color}-400 dark:ring-${color}-500`
                  : `ring ring-transparent`
              "
              @click="selectPrimaryColor(color)"
            >
              <ColorsPlaceholder
                :primary-bg="`bg-${color}-500`"
                :secondary-bg="`bg-${secondaryColor}-500`"
              />
            </div>
          </div>
        </div>
        <!-- secondary -->
        <div>
          <h5 class="mb-1 text-gray-500">Secondary color</h5>
          <div class="flex w-full gap-2 px-1 py-2 overflow-x-auto">
            <div
              v-for="color in secondaryColorsSorted"
              :key="color"
              class="min-w-[90px] cursor-pointer duration-300 hover:scale-105 max-w-[90px] max-h-[180px] m-1 rounded-md shadow-sm"
              :class="
                secondaryColor === color
                  ? `ring ring-${secondaryColor}-500`
                  : `ring ring-transparent`
              "
              @click="selectSecondaryColor(color)"
            >
              <ColorsPlaceholder
                :primary-bg="`bg-${primaryColor}-500`"
                :secondary-bg="`bg-${color}-500`"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- modes -->
      <div class="flex mt-4">
        <div
          class="flex justify-between gap-1 p-1 border rounded-lg border-slate-200 dark:border-slate-700"
          :class="[
            { 'bg-slate-100 dark:bg-slate-800': isModeBtnActive('light') },
            { 'bg-stone-200 dark:bg-stone-700': isModeBtnActive('sepia') },
            { 'bg-slate-300 dark:bg-slate-600': isModeBtnActive('dark') },
          ]"
        >
          <ClientOnly>
            <ClientOnly>
              <UButton
                :icon="'i-heroicons-computer-desktop'"
                :color="isModeBtnActive('system') ? appConfig.ui.primary : 'gray'"
                variant="ghost"
                aria-label="Theme"
                @click="changeAppTheme('system')"
              />

              <template #fallback>
                <div class="w-8 h-8" />
              </template>
            </ClientOnly>

            <UButton
              :icon="'i-heroicons-sun'"
              :color="isModeBtnActive('light') ? appConfig.ui.primary : 'gray'"
              variant="ghost"
              aria-label="Theme"
              @click="changeAppTheme('light')"
            />

            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
          <ClientOnly>
            <UButton
              :icon="'i-heroicons-moon'"
              :color="isModeBtnActive('dark') ? appConfig.ui.primary : 'gray'"
              variant="ghost"
              aria-label="Theme"
              @click="changeAppTheme('dark')"
            />

            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <div>
          <UButton
            :ui="{
              rounded: 'rounded-full',
            }"
            icon="i-heroicons-check-20-solid"
            label="Apply"
            @click="requiresReload ? toggleConfirmationToReload() : done()"
          />
        </div>
        <div class="flex items-center">
          <UTooltip class="hidden md:flex" text="Remember the changes">
            <UToggle
              v-model="rememberChanges"
              icon-on="i-heroicons-check-20-solid"
              icon-off="i-heroicons-x-mark-20-solid"
            />
          </UTooltip>

          <div class="flex items-center gap-1 md:hidden">
            <p class="text-sm">Remember the changes:</p>
            <UToggle
              v-model="rememberChanges"
              icon-on="i-heroicons-check-20-solid"
              icon-off="i-heroicons-x-mark-20-solid"
            />x
          </div>
        </div>
      </div>
    </template>
  </UCard>

  <!-- confirmation to reload the page -->
  <!-- TODO:: make it shared -->
  <UModal v-model="confirmationToReload">
    <div class="flex flex-col p-5">
      <div>
        <h3 class="mb-2 text-lg font-semibold">Reload the page?</h3>
        <p class="px-1 text-sm text-gray-500 dark:text-gray-400">
          you're choosing to use your device's theme, for us to make sure that we've picked up the
          right colors it's better to reload the page.
        </p>
        <div class="px-1">
          <small class="text-gray-400 dark:text-gray-500">
            this case only happens when you're using the system theme and then you change the
            settings without changing the theme, so we need to double check that we're gonna use the
            correct colors.
          </small>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="flex gap-1">
          <UButton
            :ui="{
              rounded: 'rounded-full',
            }"
            icon="i-heroicons-arrow-right-circle"
            label="No need to reload"
            @click="done"
          />
          <UButton
            :ui="{
              rounded: 'rounded-full',
            }"
            icon="i-heroicons-arrow-path"
            label="Reload"
            variant="soft"
            @click="reload"
          />
        </div>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const colorMode = useColorMode();
  const appConfig = useAppConfig();

  const primaryColorsSorted = computed<string[]>(() => {
    return appConfig.ui.colors.sort((a: string, b: string) => {
      if (a === appConfig.ui.primary) {
        return -1;
      } else if (b === appConfig.ui.primary) {
        return 1;
      } else {
        return 0;
      }
    });
  });
  const secondaryColorsSorted = computed<string[]>(() => {
    return appConfig.ui.grayColors.sort((a: string, b: string) => {
      if (a === appConfig.ui.gray) {
        return -1;
      } else if (b === appConfig.ui.gray) {
        return 1;
      } else {
        return 0;
      }
    });
  });

  const primaryColor = ref<string>('green'); // fallback to green
  const secondaryColor = ref<string>('cool'); // fallback to cool

  const selectPrimaryColor = (color: string) => {
    if (!color) return;

    primaryColor.value = color;
  };
  const selectSecondaryColor = (color: string) => {
    if (!color) return;

    secondaryColor.value = color;
  };

  const selectedTheme = ref<string>('system'); // fallback to system

  const isModeBtnActive = (mode: string) => {
    return selectedTheme.value === mode;
  };

  const changeAppTheme = (mode: string) => {
    if (!mode) return;

    selectedTheme.value = mode;
  };

  const hasDataChanged = computed<boolean>(() => {
    return (
      primaryColor.value !== appConfig.ui.primary ||
      secondaryColor.value !== appConfig.ui.gray ||
      selectedTheme.value !== colorMode.preference
    );
  });

  const requiresReload = computed<boolean>(() => {
    // this is a workaround for a bug in the colorMode plugin, it turns the colors to light mode if you choose system mode and it was already in system mode, so wee need to reload the page to fix it
    return (
      colorMode.preference === 'system' && selectedTheme.value === 'system' && hasDataChanged.value
    );
  });

  const rememberChanges = ref<boolean>(true);

  const appSettings = computed(() => {
    return {
      mode: selectedTheme.value,
      color: {
        primary: primaryColor.value,
        secondary: secondaryColor.value,
      },
    };
  });

  const confirmationToReload = ref<boolean>(false);

  const toggleConfirmationToReload = () => {
    confirmationToReload.value = !confirmationToReload.value;
  };

  const applyChanges = () => {
    if (!hasDataChanged.value) {
      emit('close');

      return;
    }
    appConfig.ui.primary = primaryColor.value;
    appConfig.ui.gray = secondaryColor.value;
    colorMode.value = selectedTheme.value;
    colorMode.preference = selectedTheme.value;

    if (rememberChanges.value) {
      const settings = JSON.stringify(appSettings.value);
      localStorage.setItem('appSettings', settings);
    }

    emit('close');
  };

  const reload = () => {
    applyChanges();

    location.reload();
  };

  const done = () => {
    confirmationToReload.value = false;

    applyChanges();
  };

  onMounted(() => {
    primaryColor.value = appConfig.ui.primary;
    secondaryColor.value = appConfig.ui.gray;
    selectedTheme.value = colorMode.preference;
  });
</script>
