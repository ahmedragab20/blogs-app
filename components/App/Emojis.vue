<template>
  <UButton>
    <slot />
  </UButton>
</template>

<script setup lang="ts">
  import { Picker } from 'emoji-mart';

  const { elKey, onSelect } = defineProps<{
    elKey: string;
    onSelect: (emoji: any) => void;
  }>();

  function selectEmoji(...args: any[]) {
    onSelect?.(args[0]);
  }

  const pickerOptions = { onEmojiSelect: selectEmoji };
  const picker = new Picker(pickerOptions);

  // @ts-ignore
  document.body.appendChild(picker);

  const emojiNodes = document.getElementsByTagName('em-emoji-picker');

  const initEmojiPicker = () => {
    // render only once and remove any duplicates
    if (emojiNodes?.length) {
      const first = emojiNodes[0] as HTMLElement;
      const el = document.getElementById(elKey);

      // set the position of the emoji picker
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const centerX = rect.left + rect.width / 2;
        const topOffset = rect.top - (el.offsetHeight + 20) - scrollTop;
        const leftOffset = centerX - first.offsetWidth / 2;

        first.style.display = 'block';
        first.style.position = 'fixed';
        first.style.top = `${topOffset}px`;
        first.style.left = `${leftOffset}px`;
        first.style.maxHeight = '200px';
        first.style.zIndex = '9999';
        first.style.overflow = 'auto';
      } else {
        first.style.removeProperty('position');
        first.style.removeProperty('top');
        first.style.removeProperty('left');
        first.style.removeProperty('max-height');
        first.style.removeProperty('z-index');
        first.style.removeProperty('overflow');
        // reset all the styles
        first.style.display = 'none';
      }

      // set the box-key attribute for the first element
      first.setAttribute('box-key', elKey);

      // remove any other emoji nodes with different box-key attribute
      for (const node of emojiNodes) {
        if (node.getAttribute('box-key') !== elKey) {
          node.remove();
        }
      }
    }
  };

  initEmojiPicker();
</script>
