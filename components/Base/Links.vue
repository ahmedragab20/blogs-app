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

    <!-- About Developer Dialog -->
    <UModal v-model="aboutDeveloperDialog">
      <About />
    </UModal>
    <!-- Pro tips modal -->
    <UModal v-model="proTipsDialog">
      <ProTips />
    </UModal>
  </div>
</template>
<script setup lang="ts">
  import { getAuth, signOut } from 'firebase/auth';

  const auth = getAuth();
  const toast = useToast();
  const router = useRouter();

  const user = useCurrentUser();

  const userPic = computed(
    () =>
      user.value?.photoURL ||
      'https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-6299533-5187865.png'
  );
  const confirmLogoutModal = ref(false);

  const links = [
    [
      {
        label: 'Profile',
        avatar: {
          src: userPic.value,
        },
        shortcuts: ['P'],
        click: () => {
          goToProfile();
        },
      },
    ],
    [
      {
        label: 'About the developer',
        icon: 'i-heroicons-question-mark-circle',
        shortcuts: ['I'],
        click: () => {
          toggleAboutDeveloperDialog();
        },
      },
      {
        label: 'Pro tips',
        icon: 'i-heroicons-light-bulb',
        shortcuts: ['/'],
        click: () => {
          toggleProTipsDialog();
        },
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
    router.push(`/profile/${user.value?.uid}`);
  };

  const logoutUser = async () => {
    confirmLogoutModal.value = false;

    await signOut(auth)
      .then(() => {
        toast.add({ title: 'you have been logged out' });
        if (process.client) {
          window.location.reload();
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      });
  };

  const aboutDeveloperDialog = ref(false);
  const toggleAboutDeveloperDialog = () => {
    aboutDeveloperDialog.value = !aboutDeveloperDialog.value;
  };

  const proTipsDialog = ref(false);
  const toggleProTipsDialog = () => {
    proTipsDialog.value = !proTipsDialog.value;
  };

  // shortcuts
  defineShortcuts({
    P: {
      usingInput: false,
      handler: () => goToProfile(),
    },
  });
  defineShortcuts({
    I: {
      usingInput: false,
      handler: () => toggleAboutDeveloperDialog(),
    },
  });
  defineShortcuts({
    '/': {
      usingInput: false,
      handler: () => toggleProTipsDialog(),
    },
  });
</script>
