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
        <div v-for="(blog, i) in blogs" class="my-3">
          <BlogCard :blog="blog" :key="i" />
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

  const blogsSorted = () => {
    return blogs.value?.sort((a, b) => {
      const aDate = new Date(a.createdAt?.seconds * 1000);
      const bDate = new Date(b.createdAt?.seconds * 1000);

      return bDate.getTime() - aDate.getTime();
    });
  };

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

  watchEffect(() => {
    console.log({ blogs: blogs.value });
    blogsSorted();
  });
</script>
