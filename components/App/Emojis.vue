<template>
  <div @mouseleave="emojiPickerUp ? emojiPickerUpHandler(false) : () => {}" class="relative">
    <UButton
      :id="`picker-btn_${componentId}`"
      class="relative z-20"
      v-bind="btnBinds"
      @click="emojiPickerUpHandler()"
    >
      <slot />
    </UButton>

    <div
      @mouseleave="emojiPickerUpHandler(false)"
      :id="`picker_${componentId}`"
      class="absolute -top-[130%] -left-1/2"
    >
      <Transition name="slide-fade">
        <div
          v-if="emojiPickerUp"
          class="w-64 p-2 rounded-lg bg-white shadow-xl z-30"
          @mouseover="emojiPickerUp = true"
        >
          hello gangiiii
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    'update-emoji': [emoji: any];
  }>();

  const { btnBinds } = defineProps<{
    btnBinds: object;
  }>();

  const componentId = ref(Generics.uuid());
  const emojiPickerUp = ref(false);
  const emojiPickerUpHandler = (value?: boolean) => {
    console.log('emojiPickerUpHandler', value);

    if (value === undefined) {
      if (!emojiPickerUp.value) {
        emojiPickerUp.value = true;
      } else {
        setTimeout(() => {
          emojiPickerUp.value = false;
        }, 1000);
      }
    } else {
      setTimeout(() => {
        emojiPickerUp.value = value as boolean;
      }, 100);
    }
  };
</script>
