<template>
  <div @mouseleave="toggle(false)" class="relative">
    <UButton @mouseover="toggle(true)" :id="`picker-btn-${componentId}`" v-bind="btnBinds">
      <slot />
    </UButton>

    <div :id="`picker-${componentId}`" class="absolute -top-10 -left-5 z-10">
      <Transition name="slide-fade">
        <div
          v-if="emojiPickerSelected"
          class="p-1 shadow-lg flex gap-1 max-w-xs justify-center items-center shadow-primary-100 rounded-xl bg-white dark:bg-gray-800 dark:shadow-primary-950"
        >
          <template v-if="!!reactions?.length">
            <div
              v-for="rect in reactions"
              :key="rect.icon"
              class="w-10 h-10 flex justify-center items-center duration-300 scale-100 active:scale-125 active:-translate-y-1 translate-y-0 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-md cursor-pointer"
              @click="updateEmoji(rect)"
            >
              <UTooltip :text="rect.name" class="capitalize">
                <img
                  :src="rect.icon"
                  :alt="`emoji-${rect.name}`"
                  class="w-full h-full duration-300 object-contain select-none pointer-events-none"
                />
              </UTooltip>
            </div>
          </template>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  import { BlogReaction } from '~/types';

  const emit = defineEmits<{
    'update-emoji': [emoji: any];
  }>();
  const { btnBinds } = defineProps<{
    btnBinds: object;
  }>();

  const componentId = ref(Generics.uuid());

  const generalStore = useGeneralStore();

  const reactions = computed(() => generalStore.blogReactions);

  const emojiPickerSelected = ref(false);
  const toggle = (v?: boolean) => {
    setTimeout(
      () => {
        emojiPickerSelected.value = v ?? !emojiPickerSelected.value;
      },
      v === true ? 100 : 300
    );
  };
  const updateEmoji = (emoji: BlogReaction) => {
    toggle();
    emit('update-emoji', emoji);
  };

  onMounted(() => {
    const picker = document.getElementById(`picker-${componentId.value}`) as HTMLElement;
    const pickerBtn = document.getElementById(`picker-btn-${componentId.value}`) as HTMLElement;

    document.addEventListener('click', (e) => {
      if (
        picker &&
        pickerBtn &&
        !picker.contains(e.target as Node) &&
        !pickerBtn.contains(e.target as Node)
      ) {
        toggle(false);
      }
    });
  });
</script>
