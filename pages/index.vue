<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4">
      <UBadge>{{ user?.email || '' }}</UBadge>

      <div class="text-3xl headline-preset first-letter:text-4xl">Here's a headline goes on!</div>
      <div class="text-preset">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim veritatis assumenda cumque,
        eaque eum itaque repellat nobis repellendus animi, architecto maxime quae soluta odit autem
        necessitatibus, repudiandae facere commodi unde? Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Enim veritatis assumenda cumque, eaque eum itaque repellat nobis
        repellendus animi, architecto maxime quae soluta odit autem necessitatibus, repudiandae
        facere commodi unde? Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim veritatis
        assumenda cumque, eaque eum itaque repellat nobis repellendus animi, architecto maxime quae
        soluta odit autem necessitatibus, repudiandae facere commodi unde?
      </div>

      <AppConfirm
        class="max-w-md mx-auto mt-4 border rounded-lg shadow-md border-base-color bg-gray-50 dark:bg-gray-800"
        :submit="() => {}"
        :cancel="() => {}"
      >
        <div class="flex px-1 text-gray-400 text-start">
          Lorem ipsum dolor sit amet consectetur, velit quisquam quaerat voluptas tempore.
        </div>
      </AppConfirm>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  const user = useCurrentUser();
</script>
