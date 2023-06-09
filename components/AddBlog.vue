<template>
  <form @submit.prevent="clickHandler(addBlog)">
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
          <!-- TODO:: make it reusable if needed -->
          <div class="flex gap-1 flex-wrap">
            <UBadge
              v-for="(tag, i) in tags"
              @click="selectTags(tag)"
              @keyup.space="selectTags(tag)"
              :color="isTagSelected(tag) ? 'primary' : 'red'"
              :key="i"
              tabindex="0"
              class="cursor-pointer"
            >
              #{{ tag.name }}
            </UBadge>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <UButton type="submit" block :disabled="!addBlogFormValid" :loading="addingBlog">
            Add Blog
          </UButton>
        </div>
      </template>
    </UCard>
  </form>
</template>
<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  import { Blog, Tag } from '~/types';

  const props = defineProps<{
    toggleAddBlogDialog: () => void;
  }>();
  const emit = defineEmits<{
    done: [status: boolean];
  }>();

  const { blogTags } = useGeneralStore();
  const toast = useToast();
  const { clickHandler } = useGuest();

  const blog = ref<Blog>({
    title: '',
    content: '',
    subtitle: '',
    tags: [],
    reactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const tags = computed<Tag[]>(() => blogTags);
  const isTagSelected = (tag: Tag) => {
    return !!blog.value.tags?.find((i) => i.name === tag.name);
  };
  const selectTags = (tag: Tag) => {
    const index = blog.value.tags?.findIndex((i) => i.name === tag.name) as number;
    if (index !== -1) {
      blog.value.tags?.splice(index, 1);
    } else {
      blog.value.tags?.push(tag);
    }
  };
  const addBlogFormValid = computed<boolean>(() => {
    return (
      !!blog.value.title &&
      !!blog.value.content &&
      !!blog.value.subtitle &&
      !!blog.value.tags?.length
    );
  });
  const addingBlog = ref(false);
  const addBlog = async () => {
    addingBlog.value = true;
    try {
      const newDoc = await BlogHandler.create(blog.value);

      if (!!newDoc) {
        emit('done', true);
        toast.add({
          title: 'Blog added successfully',
          description: 'Your blog has been added successfully',
          type: 'success',
        });
        props.toggleAddBlogDialog?.();
        blog.value = {
          blogId: '',
          title: '',
          content: '',
          subtitle: '',
          tags: [],
          reactions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        Debug.warn({ message: '⚠️ failed to add the new blog!', source: 'index.vue' });
      }
    } catch (error) {
      Debug.error({
        message: '🚨 Error adding document',
        source: 'index.vue',
        data: error,
        useOnProduction: true,
      });
    } finally {
      addingBlog.value = false;
    }
  };
</script>
