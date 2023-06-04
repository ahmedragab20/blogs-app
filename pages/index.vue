<template>
  <div class="min-h-screen">
    <UContainer>
      <!-- Add blog -->
      <div>
        <BlogsAddNew @click="clickHandler(toggleAddBlogDialog)" />
      </div>

      <!-- blogs -->
      <template v-if="blogs?.length">
        <div v-for="blog in blogs" :key="blog.blogId" class="my-3">
          <BlogCard :blog="blog" @re-fetch="setBlogsData" />
        </div>
      </template>
    </UContainer>
  </div>

  <!-- add blog dialog -->
  <UModal v-model="addBlogDialog">
    <AddBlog :toggle-add-blog-dialog="toggleAddBlogDialog" @done="setBlogsData" />
  </UModal>
</template>

<script setup lang="ts">
  import { Blog } from '~/types';
  const { clickHandler } = useGuest();

  const blogs = ref<Blog[]>();
  //✅TODO:: add sorting
  //✅TODO:: fix the wrong user data after adding new blog to the list

  const addBlogDialog = ref(false);
  const toggleAddBlogDialog = () => {
    addBlogDialog.value = !addBlogDialog.value;
  };
  const setBlogsData = async () => {
    blogs.value = (await BlogHandler.getAll()) as Blog[];
  };

  watchEffect(async () => {
    await setBlogsData();
  });
  defineShortcuts({
    N: {
      usingInput: false,
      handler: () => toggleAddBlogDialog(),
    },
  });

  useHead({
    title: 'ArBlogs | Home',
  });
</script>
