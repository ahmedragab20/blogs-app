<template>
  <div class="min-h-screen">
    <UContainer>
      <!-- Add blog -->
      <div>
        <BlogsAddNew @click="clickHandler(addBlog)" />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  const addBlog = () => {
    Debug.log({ message: 'Add new blog', source: 'index.vue' });
  };

  const { clickHandler } = useGuest();
</script>
