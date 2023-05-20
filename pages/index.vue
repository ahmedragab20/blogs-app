<template>
  <div class="flex items-center justify-center min-h-screen">
    <UContainer class="mt-4">
      <div class="font-headline text-3xl first-letter:text-4xl text-gray-800 dark:text-gray-300">
        Here's a headline goes on!
      </div>
      <div class="font-body text-gray-600">
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
        class="bg-gray-50 dark:bg-gray-800 rounded-lg max-w-md mt-4 mx-auto shadow-md"
        :submit="() => {}"
        :cancel="() => {}"
        label-class="text-start"
      >
        <div class="flex text-start px-2 text-gray-400">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur sequi sed harum,
          velit quisquam quaerat voluptas tempore obcaecati aliquam optio ducimus delectus totam
          tenetur, distinctio, quo asperiores! Possimus, molestias facilis.
        </div>
      </AppConfirm>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  //
</script>
