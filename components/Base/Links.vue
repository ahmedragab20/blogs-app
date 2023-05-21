<template>
  <div>
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton color="white" label="" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
  </div>
</template>
<script setup lang="ts">
  const toast = useToast();
  // const user = await getCurrentUser();

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

  const items = [
    [
      {
        label: 'Profile',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/739984?v=4',
        },
        shortcuts: ['P'],
      },
    ],
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        shortcuts: ['E'],
      },
      {
        label: 'Duplicate',
        icon: 'i-heroicons-document-duplicate-20-solid',
        shortcuts: ['D'],
      },
    ],
    [
      {
        label: 'Logout',
        icon: 'i-heroicons-archive-box-20-solid',
        click: () => {
          toast.add({ title: "we'll log you out don't cry!!" });
        },
      },
    ],
  ];
</script>
