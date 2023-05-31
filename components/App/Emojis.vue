<template>
  <div class="relative">
    <UButton id="picker-btn" v-bind="btnBinds" @click="toggle">
      <slot />
    </UButton>

    <div
      id="picker"
      class="absolute sm:-bottom-[50px] -bottom-20 sm:left-10 left-0 z-10 sm:scale-100 scale-75"
    >
      <Transition name="slide-fade">
        <!-- <Picker
          v-if="emojiPickerSelected"
          :data="emojiIndex"
          title="How do u c the blog?"
          emoji="point_up"
          class="shadow-xl shadow-primary-100 text-primary-500"
          @select="updateEmoji"
        /> -->
        <div
          v-if="emojiPickerSelected"
          class="w-96 h-36 shadow-lg flex justify-center items-center shadow-purple-200 rounded-xl bg-white"
        >
          <p v-twemoji>
            {{ emojiText }}
          </p>
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
  const nuxtApp = useNuxtApp();

  const emojiText = ref('I ❤️ Twemoji!');

  // const emojiIndex = ref(nuxtApp.$emojiIndex);

  const emojiPickerSelected = ref(false);
  const toggle = () => {
    emojiPickerSelected.value = !emojiPickerSelected.value;
  };
  const updateEmoji = (emoji: any) => {
    toggle();
    console.log(emoji);
    emit('update-emoji', emoji);
  };
  onMounted(() => {
    //     const picker = document.getElementById('picker') as HTMLElement;
    //     const pickerBtn = document.getElementById('picker-btn') as HTMLElement;
    //
    //     document.addEventListener('click', (e) => {
    //       if (
    //         picker &&
    //         pickerBtn &&
    //         !picker.contains(e.target as Node) &&
    //         !pickerBtn.contains(e.target as Node)
    //       ) {
    //         emojiPickerSelected.value = false;
    //       }
    //     });
  });
</script>
