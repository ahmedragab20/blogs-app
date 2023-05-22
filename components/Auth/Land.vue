<template>
  <!-- this is shared space for the auth modules -->
  <div>
    {{ target }}
    <AuthLogin v-if="target === 'login'" />
  </div>
</template>
<script setup lang="ts">
  import { AuthLand } from '@/types';

  const { target = 'login' } = defineProps<{
    target?: AuthLand;
  }>();
</script>
