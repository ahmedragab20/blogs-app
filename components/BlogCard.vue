<template>
  <UCard v-if="!!blog">
    <template #header>
      <!-- user -->
      <div class="flex">
        <div
          @click="goToProfile(blog?.user?.uid!)"
          class="flex items-center space-x-2 cursor-pointer"
        >
          <div>
            <UAvatar class="select-none" :src="userBlogPicture" :alt="blog.user?.displayName" />
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
    </template>
    <div>
      <div class="text-xl sm:text-2xl font-bold text-primary-500 font-headline truncate">
        {{ blog.title }}
      </div>
      <div class="text-sm text-gray-500">{{ blog.subtitle }}</div>
    </div>
    <div class="mt-4 relative">
      <div class="text-sm text-gray-500">{{ blog.content }}</div>
    </div>
    <div class="mt-4">
      <div class="flex flex-wrap space-x-2">
        <div v-for="(tag, i) in blog.tags" :key="i">
          <UBadge>{{ tag.name }}</UBadge>
        </div>
      </div>
    </div>
    <template v-if="Generics.valuesMatch(user?.uid, blog?.user?.uid)" #footer>
      <div class="flex justify-end space-x-2">
        <div>
          <UButton @click="BlogHandler.update()" icon="i-heroicons-pencil" variant="soft">
            Update
          </UButton>
        </div>
        <div>
          <UButton
            @click="BlogHandler.delete()"
            icon="i-heroicons-trash"
            variant="ghost"
            color="red"
          >
            Delete
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
<script setup lang="ts">
  import { Blog } from '~/types';

  const { blog } = defineProps<{
    blog: Partial<Blog>;
  }>();
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
</script>
