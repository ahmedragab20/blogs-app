<template>
  <div id="picker" ref="pickerDom"></div>
</template>
<script setup lang="ts">
  import { Picker } from 'emoji-mart';
  const pickerOptions = { onEmojiSelect: console.log };
  const picker = new Picker(pickerOptions);

  const emojisDom = document.body.appendChild(picker);
  const pickerDiv = document.getElementsByTagName('em-emoji-picker');
  console.log(pickerDiv?.[0].classList.add('fixed', 'top-0', 'right-0', 'z-50'));
</script>
