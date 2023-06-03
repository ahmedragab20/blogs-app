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
      <div>
        <div class="pb-2">
          <div class="flex items-center -space-x-1 overflow-auto py-1">
            <div v-for="(rect, i) in blog.reactions" :key="i">
              <div class="hover:scale-110 transition-transform duration-300 ease-in-out">
                <UAvatar
                  class="select-none pointer-events-none"
                  :src="rect.icon"
                  :alt="rect.icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!updateBlogMode" class="flex space-x-2 justify-between">
        <!-- Reactions -->
        <div class="flex space-x-2" :id="blog.blogId!">
          <AppEmojis
            :key="`app-emojis-${blog.blogId}`"
            :btn-binds="reactionBtnPreset"
            @updateEmoji="emojiSelected"
          >
            <div class="flex gap-1">
              <template v-if="!!myReaction">
                <div class="w-5 h-5">
                  <img
                    :src="myReaction.icon"
                    :alt="`${myReaction.key} icon`"
                    class="w-full h-full object-contain"
                  />
                </div>
              </template>
              <template v-else> 👀</template>
              <div>
                {{ localReactionsCount || '--' }}
              </div>
            </div>
          </AppEmojis>
        </div>
        <!-- Update Blog -->
        <div v-if="Generics.valuesMatch(user?.uid, blog?.user?.uid)" class="flex space-x-2">
          <div>
            <UButton @click="toggleUpdateBlogMode" icon="i-heroicons-pencil" variant="soft">
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
  import { Blog, BlogReaction, ReactionReturn, Tag } from '~/types';
  import Reaction from '~/utils/Reaction';
  const { blogTags } = useGeneralStore();
  const { clickHandler } = useGuest();

  const { blog } = defineProps<{
    blog: Partial<Blog>;
  }>();
  const blogClone = ref<Partial<Blog>>();

  const router = useRouter();
  const user = useCurrentUser();

  const userBlogPicture = computed(() => {
    return (
      blog.user?.photoURL ||
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
  const allReactionsCount = computed(() => {
    return blog.reactions?.reduce((acc, curr) => {
      return acc + curr.users.length;
    }, 0);
  });

  const localReactionsCount = ref();

  const myReaction = ref<BlogReaction>();

  const emojiSelected = async (reaction: BlogReaction) => {
    const user = useCurrentUser()?.value?.uid;
    // check if user is logged in
    clickHandler(); //TODO:: improve the naming of this function
    if (!user) return;

    //@ts-ignore
    const { count }: Partial<ReactionReturn> = await Reaction.react(blog.blogId!, reaction, {
      count: true,
    });

    localReactionsCount.value = count;

    if (myReaction.value?.key === reaction.key) {
      myReaction.value = undefined;
    } else {
      myReaction.value = reaction;
    }
  };

  watchEffect(() => {
    blogClone.value = Generics.clone(blog);
    updatedTags.value = blogClone.value?.tags ?? [];

    myReaction.value = blogClone.value.reactions?.find((rc: BlogReaction) => {
      return rc?.users?.some((u) => u.uid === user.value?.uid);
    });
  });
  onMounted(() => {
    localReactionsCount.value = allReactionsCount.value;
  });
</script>
