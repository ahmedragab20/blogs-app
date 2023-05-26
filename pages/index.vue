<template>
  <div class="min-h-screen">
    <UContainer>
      <!-- Add blog -->
      <div>
        <BlogsAddNew @click="Debug.log({})" />
      </div>
    </UContainer>
    <!--
      TODO:: Add helper to manage the guest user actions
     -->
  </div>
</template>

<script setup lang="ts">
  // onMounted(() => {
  //   Debug.error({
  //     message: 'Hello world',
  //     data: {
  //       name: 'John Doe',
  //       age: 20,
  //       address: {
  //         street: '123 Main St',
  //         city: 'New York',
  //         state: 'NY',
  //         zip: '10001',
  //       },
  //     },
  //   });
  // });
</script>
