<template>
  <div>
    <div v-if="defaultSlotExists" class="flex flex-col p-3 sm:p-5">
      <div>
        <h3 class="mb-2 text-lg font-semibold">
          {{ label }}
        </h3>
        <!-- content -->
        <div>
          <slot />
        </div>
      </div>
      <div class="flex mt-3">
        <div class="flex gap-1">
          <UButton
            :ui="
              ui || {
                rounded: 'rounded-full',
              }
            "
            :variant="variant"
            :icon="submitIcon"
            :label="submitLabel"
            @click="submit"
          />
          <UButton
            :ui="
              ui || {
                rounded: 'rounded-full',
              }
            "
            :icon="cancelIcon"
            :label="cancelLabel"
            :variant="variant"
            @click="cancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  interface UI {
    [key: string]: string;
    rounded: string;
  }

  const props = withDefaults(
    defineProps<{
      label?: string;
      submit: () => void;
      cancel: () => void;
      submitIcon?: string;
      cancelIcon?: string;
      submitLabel?: string;
      cancelLabel?: string;
      variant?: string;
      ui?: Partial<UI>;
    }>(),
    {
      label: 'confirming with you!',
      submitLabel: 'Submit',
      cancelLabel: 'Cancel',
      submitIcon: '',
      cancelIcon: '',
      variant: 'soft',
    }
  );

  const slots = useSlots();

  const defaultSlotExists = computed(() => {
    return Object.keys(slots).includes('default');
  });

  onMounted(() => {
    if (!defaultSlotExists) {
      alert('Confirm component requires a default slot');
      throw new Error('Confirm component requires a default slot');
    }
  });
</script>
