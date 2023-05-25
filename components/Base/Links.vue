<template>
  <div>
    <UDropdown :items="links" :popper="{ placement: 'bottom-start' }" :ui="dropdownPreset">
      <UButton color="white" label="" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>

    <!-- confirm logging out -->
    <UModal v-model="confirmLogoutModal">
      <AppConfirm
        :submit="logoutUser"
        :cancel="
          () => {
            confirmLogoutModal = false;
          }
        "
        submit-label="Logout"
        submit-color="red"
        submit-variant="solid"
        cancel-color="red"
        cancel-variant="soft"
      >
        <p class="my-2">Are you sure you want to logout?</p>
      </AppConfirm>
    </UModal>
  </div>
</template>
<script setup lang="ts">
  import { getAuth, signOut } from 'firebase/auth';

  const auth = getAuth();
  const toast = useToast();
  const router = useRouter();

  const user = useCurrentUser();

  const userPic = computed(() => user.value?.photoURL || import.meta.env.VITE_PLACEHOLDER_AVATAR);
  const confirmLogoutModal = ref(false);

  const links = [
    [
      {
        label: 'Profile',
        avatar: {
          src: userPic.value,
        },
        shortcuts: ['P'],
      },
    ],
    [
      {
        label: 'About the developer',
        icon: 'i-heroicons-question-mark-circle',
      },
    ],
    [
      {
        label: 'Logout',
        icon: 'i-heroicons-archive-box-20-solid',
        click: () => {
          confirmLogoutModal.value = true;
        },
      },
    ],
  ];

  const dropdownPreset = {
    item: {
      base: 'group flex items-center gap-2 w-full cursor-pointer',
    },
    // resource:: https://github.com/nuxtlabs/ui/blob/dev/src/runtime/components/elements/Dropdown.vue
  };

  const goToProfile = () => {
    alert('go to profile');
  };

  const logoutUser = async () => {
    confirmLogoutModal.value = false;

    await signOut(auth)
      .then(() => {
        toast.add({ title: 'you have been logged out' });
        router.push('/');
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      });
  };

  defineShortcuts({
    P: {
      usingInput: false,
      handler: () => goToProfile(),
    },
  });

  onMounted(() => {
    console.log(user);
  });
</script>
