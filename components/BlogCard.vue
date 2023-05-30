<template>
  <UCard v-if="!!blog" class="overflow-visible">
    <template #header>
      <div class="flex justify-between items-center">
        <!-- user -->
        <div class="flex items-center">
          <div
            @click="goToProfile(blog?.user?.uid!)"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <div>
              <UAvatar
                class="select-none pointer-events-none"
                :src="userBlogPicture"
                :alt="blog.user?.displayName"
              />
            </div>
            <div>
              <div class="text-sm font-semibold text-primary-500 font-headline">
                {{ blog.user?.displayName || 'Unnamed' }}
                <!-- if it's me -->
                <template v-if="Generics.valuesMatch(user?.uid, blog?.user?.uid)">
                  <UBadge size="xs" class="text-xs text-gray-500">me</UBadge>
                </template>
              </div>
              <div class="text-xs text-gray-500">{{ blog.user?.email }}</div>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="text-xs text-gray-500 font-headline"
            v-text="Generics.dateSince(blog.createdAt!)"
          ></div>
        </div>
      </div>
    </template>
    <div>
      <div
        id="blog-title"
        class="text-xl sm:text-2xl font-bold text-primary-500 font-headline truncate"
        :class="{ 'bg-gray-50 dark:bg-gray-800 p-1': updateBlogMode }"
        :contenteditable="updateBlogMode"
      >
        {{ blog.title }}
      </div>
      <div
        id="blog-subtitle"
        class="text-sm text-gray-500"
        :class="{ 'bg-gray-50 dark:bg-gray-800 p-1': updateBlogMode }"
        :contenteditable="updateBlogMode"
      >
        {{ blog.subtitle }}
      </div>
    </div>
    <div class="mt-4 relative">
      <div
        id="blog-content"
        class="text-sm text-gray-500"
        :class="{ 'bg-gray-50 dark:bg-gray-800 p-1': updateBlogMode }"
        :contenteditable="updateBlogMode"
      >
        {{ blog.content }}
      </div>
    </div>
    <div class="mt-4">
      <!-- reactions -->
      <div>
        <div v-for="reaction in blog.reactions">
          {{ reaction.native }}
        </div>
      </div>
      <div class="flex flex-wrap space-x-2">
        <template v-if="!updateBlogMode">
          <div v-for="(tag, i) in blog.tags" :key="i">
            <UBadge>#{{ tag.name }}</UBadge>
          </div>
        </template>
        <template v-else>
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
        </template>
      </div>
    </div>
    <template #footer>
      <div v-if="!updateBlogMode" class="flex space-x-2 justify-between">
        <!-- Reactions -->
        <div class="flex space-x-2" :id="blog.blogId!">
          <AppEmojis :btn-binds="reactionBtnPreset" @updateEmoji="emojiSelected"> ⚡️ </AppEmojis>
        </div>
        <!-- Update Blog -->
        <div v-if="Generics.valuesMatch(user?.uid, blog?.user?.uid)" class="flex space-x-2">
          <div>
            <UButton @click="toggleUpdateBlogMode" icon="i-heroicons-pencil" variant="soft">
              Update
            </UButton>
          </div>
          <div>
            <UButton
              @click="toggleDeleteBlogModal"
              icon="i-heroicons-trash"
              variant="ghost"
              color="red"
              :loading="deletingBlog"
            >
              Delete
            </UButton>
          </div>
        </div>
      </div>
      <!-- no need to add check for the authority cuz the trigger for this will be hidden by default -->
      <div v-else>
        <div class="flex space-x-2 justify-end">
          <div class="flex items-center gap-2">
            <div>
              <UButton
                @click="discardBlogChanges"
                icon="i-heroicons-backspace"
                variant="ghost"
                color="red"
              >
                Discard
              </UButton>
            </div>
            <div>
              <UButton
                icon="i-heroicons-check"
                variant="soft"
                :loading="updatingBlog"
                @click="updateBlog"
              >
                Save
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UCard>

  <!-- delete blog modal -->
  <UModal v-model="deleteBlogModal">
    <AppConfirm
      :submit="() => deleteBlog(blog.blogId!)"
      :cancel="toggleDeleteBlogModal"
      submit-label="Delete Blog"
      submit-color="red"
      submit-variant="solid"
      cancel-color="red"
      cancel-variant="soft"
      :loading="deletingBlog"
    >
      <p class="px-1 text-preset">Are you sure you want to delete this blog?</p>
    </AppConfirm>
  </UModal>
</template>
<script setup lang="ts">
  import { useGeneralStore } from '~/stores/general';
  import { Blog, Tag } from '~/types';

  const { blogTags, blogReactions } = useGeneralStore();

  const { blog } = defineProps<{
    blog: Partial<Blog>;
  }>();
  const blogClone = ref<Partial<Blog>>();

  const router = useRouter();
  const user = useCurrentUser();

  const userBlogPicture = computed(() => {
    return (
      blog.user?.photoURL ??
      'https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-6299533-5187865.png'
    );
  });
  const goToProfile = (userUID: string) => {
    if (!!userUID) {
      router.push(`/profile/${userUID}`);
    }
  };

  const updateBlogMode = ref(false);
  const toggleUpdateBlogMode = () => {
    updateBlogMode.value = !updateBlogMode.value;
  };

  const updatedTags = ref<Tag[]>([]);
  const tags = computed<Tag[]>(() => blogTags);
  const isTagSelected = (tag: Tag) => {
    return !!updatedTags.value?.find((i) => i.name === tag.name);
  };
  const selectTags = (tag: Tag) => {
    const index = updatedTags.value?.findIndex((i) => i.name === tag.name) as number;
    if (index !== -1) {
      updatedTags.value?.splice(index, 1);
    } else {
      updatedTags.value?.push(tag);
    }
  };

  const updateBlogError = ref<string>();
  const updatingBlog = ref(false);
  const updateBlog = async () => {
    try {
      updatingBlog.value = true;
      const blogTitle = document.getElementById('blog-title') as HTMLElement;
      const blogSubtitle = document.getElementById('blog-subtitle') as HTMLElement;
      const blogContent = document.getElementById('blog-content') as HTMLElement;

      if (
        !blogTitle?.innerHTML?.length ||
        !blogSubtitle?.innerHTML?.length ||
        !blogContent?.innerHTML?.length ||
        !updatedTags.value?.length
      ) {
        updateBlogError.value = 'You must fill in all of the required data';
        return;
      }

      const updatedBlog: Partial<Blog> = {
        blogId: blog.blogId,
        title: blogTitle.innerText,
        subtitle: blogSubtitle.innerText,
        content: blogContent.innerText,
        tags: updatedTags.value,
      };

      await BlogHandler.update(updatedBlog);

      blogClone.value = JSON.parse(JSON.stringify(updatedBlog));
      toggleUpdateBlogMode();
    } catch (error) {
      console.log(error);
    } finally {
      updatingBlog.value = false;
    }
  };

  const discardBlogChanges = () => {
    const blogTitle = document.getElementById('blog-title') as HTMLElement;
    const blogSubtitle = document.getElementById('blog-subtitle') as HTMLElement;
    const blogContent = document.getElementById('blog-content') as HTMLElement;

    blogTitle.innerText = blogClone.value?.title ?? '';
    blogSubtitle.innerText = blogClone.value?.subtitle ?? '';
    blogContent.innerText = blogClone.value?.content ?? '';

    updatedTags.value = blogClone.value?.tags ?? [];
    updateBlogError.value = '';

    toggleUpdateBlogMode();
  };

  const deleteBlogModal = ref(false);
  const toggleDeleteBlogModal = () => {
    deleteBlogModal.value = !deleteBlogModal.value;
  };

  const deletingBlog = ref(false);
  const deleteBlog = async (blogId: string): Promise<void> => {
    try {
      deletingBlog.value = true;
      await BlogHandler.delete(blogId);
      toggleDeleteBlogModal();
    } catch (error) {
      console.log(error);
    } finally {
      deletingBlog.value = false;
    }
  };

  // Reactions hustle
  const reactionBtnPreset = ref({
    variant: 'soft',
    ui: {
      rounded: 'rounded-full',
    },
  });

  const emojiSelected = (em: any) => {
    const emoji = {
      id: em._sanitized?.id,
      colons: em._sanitized?.colons,
      key: em._sanitized?.id,
      name: em._sanitized?.name,
      skin: em._sanitized?.skin,
      unified: em._sanitized?.unified,
      native: em._sanitized?.native,
    };

    console.log(emoji);

    if (!emoji) {
      return;
    }

    Reaction.react(blog, emoji as any);
  };
  onMounted(() => {
    blogClone.value = JSON.parse(JSON.stringify(blog));
    updatedTags.value = blogClone.value?.tags ?? [];
  });
</script>
