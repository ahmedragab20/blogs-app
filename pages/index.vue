<template>
  <div class="min-h-screen">
    <UContainer>
      <!-- Add blog -->
      <div>
        <BlogsAddNew @click="clickHandler(toggleAddBlogDialog)" />
      </div>
    </UContainer>
  </div>

  <!-- add blog dialog -->
  <UModal v-model="addBlogDialog">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-primary-500 font-headline">Add new blog</h2>
      </template>
      <div class="flex flex-col space-y-4">
        <div>
          <UInput name="blog-title" v-model="blog.title" placeholder="Title" class="w-full" />
        </div>
        <div>
          <UInput
            name="blog-subtitle"
            v-model="blog.subtitle"
            placeholder="Subtitle"
            class="w-full"
          />
        </div>
        <div>
          <UTextarea
            name="blog-content"
            v-model="blog.content"
            placeholder="Content"
            class="w-full"
          />
        </div>
        <div>
          <div>
            <USelect
              v-model="blog.tags"
              name="blog-tags"
              placeholder="Tag..."
              text-attribute="name"
              :options="tags"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <UButton
            @click="clickHandler(addBlog)"
            block
            variant="soft"
            class="bg-primary-500 text-white"
          >
            Add
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  import { Blog, Tag } from '~/types';
  const { clickHandler } = useGuest();
  const { blogTags } = useGeneralStore();
  const addBlogDialog = ref(false);
  const toggleAddBlogDialog = () => {
    addBlogDialog.value = !addBlogDialog.value;
  };

  const blog = ref<Partial<Blog>>({
    id: '',
    title: '',
    content: '',
    subtitle: '',
    tags: [],
  });
  const tags = computed<Tag[]>(() => blogTags);
  const addBlog = () => {
    Debug.log({ message: 'Add new blog', source: 'index.vue' });
  };

  onMounted(() => {
    Debug.log({ message: 'Mounted', source: 'index.vue', data: tags.value });
  });
</script>
