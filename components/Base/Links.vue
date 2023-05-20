<template>
  <div class="bg-stone-950 dark:bg-slate-100">
    <div class="w-full sm:w-[70%] mx-auto flex flex-wrap justify-center">
      <NuxtLink
        v-for="link in links"
        :key="link.id"
        :to="link.path"
        active-class="shadow-md shadow-slate-500"
        class="w-1/2 sm:w-1/4 text-white dark:text-stone-950 border border-slate-100 dark:border-stone-950 flex justify-center items-center p-3 sm:p-5 select-none"
      >
        {{ link.name }}
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
  const user = await getCurrentUser();
  console.log({ user });

  const links = computed(() => {
    const global = [
      {
        id: '68789f09-da10-4905-813a-26d7f6e59bc6',
        name: 'Home',
        path: '/',
      },
      {
        id: '68789f09-da10-4905-813a-26d7f6e59bc7',
        name: 'Contact',
        path: '/contact',
      },
    ];
    const personal = [
      {
        id: '68789f09-da10-4905-813a-26d7f6e59bc8',
        name: 'Profile',
        path: '/profile',
      },
      {
        id: '68789f09-da10-4905-813a-26d7f6e59bc9',
        name: 'Settings',
        path: '/settings',
      },
    ];

    return true ? [...global, ...personal] : global;
  });
</script>
