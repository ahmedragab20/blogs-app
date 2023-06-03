<template>
  <div class="min-h-screen">
    <UContainer>
      <!-- Add blog -->
      <div>
        <BlogsAddNew @click="clickHandler(toggleAddBlogDialog)" />
      </div>

      <!-- blogs -->
      <template v-if="blogs?.length">
        <!-- TODO:: Sort it properly -->
        <div v-for="blog in blogs" :key="blog.id" class="my-3">
          <!--
            TIP::
              --- don't use the index as a key, it will cause a wrong data passed into the component issue.
           -->
          <BlogCard :blog="blog" />
        </div>
      </template>
    </UContainer>
  </div>

  <!-- add blog dialog -->
  <UModal v-model="addBlogDialog">
    <AddBlog :toggle-add-blog-dialog="toggleAddBlogDialog" />
  </UModal>
</template>

<script setup lang="ts">
  import { collection } from 'firebase/firestore';
  const { clickHandler } = useGuest();
  const db = useFirestore();

  const blogs = useCollection(collection(db, 'blogs'));
  //TODO:: add sorting
  //TODO:: fix the wrong user data after adding new blog to the list

  const addBlogDialog = ref(false);
  const toggleAddBlogDialog = () => {
    addBlogDialog.value = !addBlogDialog.value;
  };

  defineShortcuts({
    N: {
      usingInput: false,
      handler: () => toggleAddBlogDialog(),
    },
  });
</script>
