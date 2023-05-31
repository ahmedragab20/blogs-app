<template>
  <div @mouseleave="toggle(false)" class="relative">
    <UButton :id="`picker-btn-${componentId}`" v-bind="btnBinds" @click="toggle()">
      <slot />
    </UButton>

    <div
      @mouseover="toggle(true)"
      :id="`picker-${componentId}`"
      class="absolute -top-10 left-0 z-10"
    >
      <Transition name="slide-fade">
        <div
          v-if="emojiPickerSelected"
          class="p-1 shadow-lg flex gap-1 justify-center items-center shadow-primary-100 rounded-xl bg-white"
        >
          <template v-if="!!reactions?.length">
            <div
              v-for="rect in reactions"
              :key="rect.icon"
              class="w-10 h-10 flex justify-center items-center duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-md cursor-pointer"
              @click="updateEmoji(rect)"
            >
              <UTooltip :text="rect.name" class="capitalize">
                <img
                  :src="rect.icon"
                  :alt="`emoji-${rect.name}`"
                  class="w-full h-full object-contain select-none pointer-events-none"
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
    emojiPickerSelected.value = v ?? !emojiPickerSelected.value;
  };
  const updateEmoji = (emoji: BlogReaction) => {
    toggle();
    console.log(emoji);
    emit('update-emoji', emoji);
  };
  onMounted(() => {
    const picker = document.getElementById('picker') as HTMLElement;
    const pickerBtn = document.getElementById('picker-btn') as HTMLElement;

    document.addEventListener('click', (e) => {
      if (
        picker &&
        pickerBtn &&
        !picker.contains(e.target as Node) &&
        !pickerBtn.contains(e.target as Node)
      ) {
        emojiPickerSelected.value = false;
      }
    });
  });
</script>
