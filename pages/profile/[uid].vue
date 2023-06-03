<template>
  <UContainer class="min-h-[90vh]">
    <div v-if="profileUser?.uid" class="flex flex-col items-center justify-center">
      <div class="w-32 h-32 rounded-full overflow-hidden shadow-xl">
        <img
          :src="userPic"
          alt="user avatar"
          class="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>
      <div class="text-center">
        <h2 class="text-2xl font-bold mt-4">{{ profileUser.displayName }}</h2>
        <p class="text-gray-500 text-sm">{{ profileUser.email }}</p>
      </div>

      <!-- update profile -->
      <template v-if="myProfile">
        <div class="mt-4">
          <UButton @click="toggleUpdateProfileDialog" icon="i-heroicons-pencil" variant="soft">
            Update Profile
          </UButton>
        </div>
        <div class="mt-2">
          <UButton
            @click="confirmDeletionDialog = true"
            icon="i-heroicons-trash"
            variant="ghost"
            color="red"
          >
            Delete Account
          </UButton>
        </div>
      </template>

      <!-- my blogs -->
      <template v-if="myBlogs?.length">
        <AppDivider class="mt-6" />
        <div>
          <h3 class="font-bold font-headline text-primary-500 mt-4">
            My Blogs ({{ myBlogs.length }})
          </h3>
        </div>
        <div v-for="blog in myBlogs" :key="blog.blogId" class="my-3 w-full sm:max-w-[600px]">
          <BlogCard :blog="blog" />
        </div>
      </template>
    </div>
    <div v-else-if="!loading" class="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <UIcon name="i-heroicons-x-circle" class="text-6xl text-red-300 dark:bg-red-500" />
      <UBadge color="red">The user is no longer exist</UBadge>
    </div>
    <div v-else class="flex justify-center items-center">
      <AppSpinner />
    </div>
  </UContainer>

  <!-- Modals -->
  <!-- update Dialog -->
  <UModal v-model="updateProfileDialog" name="updateProfileDialog">
    <UCard>
      <template #header>
        <div>
          <h3 class="font-bold font-headline">Update Profile</h3>
        </div>
      </template>
      <div>
        <div>
          <!-- input for image url -->
          <div>
            <!-- TODO:: add external avatar or select one -->
            <template v-if="false">
              <UInputGroup label="Your Image URL" :help="changePicHint">
                <UInput
                  v-model="updateUserForm.photoURL"
                  name="photoURL"
                  placeholder="Image URL"
                  icon="i-heroicons-link"
                />
              </UInputGroup>
            </template>
            <template v-else>
              <!-- avatars -->
              <div>
                <div class="flex flex-wrap justify-center">
                  <template v-for="(avatar, index) in avatars">
                    <div
                      @click="selectAvatar(avatar)"
                      class="w-20 h-20 rounded-full overflow-hidden shadow-inner m-2 cursor-pointer transition-all duration-300 active:scale-95"
                      :class="{
                        'shadow-primary-500': isAvatarSelected(avatar),
                      }"
                    >
                      <img
                        :src="avatar"
                        alt="avatar"
                        class="w-full h-full object-cover select-none pointer-events-none"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <!-- input for display name -->
          <div class="mt-4">
            <UInput
              v-model="updateUserForm.displayName"
              name="displayName"
              placeholder="Display Name"
              icon="i-heroicons-user-circle"
            />
          </div>

          <div class="mt-4">
            <UButton
              @click="updateUserProfile"
              icon="i-heroicons-pencil"
              variant="soft"
              :loading="updatingProfile"
              :disabled="!updateProfileFormValid"
            >
              Update Profile
            </UButton>
          </div>
        </div>
      </div>
      <template #footer>
        <UBadge color="yellow" class="w-full">
          <strong>
            NOTE: <br />
            when you update your profile, it will - NOT - be updated in your old blogs.
          </strong>
        </UBadge>
      </template>
    </UCard>
  </UModal>

  <!-- delete account dialog -->
  <UModal v-model="confirmDeletionDialog">
    <AppConfirm
      :submit="confirmDeleteUser"
      :cancel="
        () => {
          confirmDeletionDialog = false;
        }
      "
      submit-label="Delete Account"
      submit-color="red"
      submit-variant="solid"
      cancel-color="red"
      cancel-variant="soft"
      :loading="deletingUser"
      :disabled="deleteConfirmationInput !== user?.email"
    >
      <div>
        <strong class="my-2 text-gray-400">This will delete your Account completely</strong>
        <UInputGroup label="" :help="`to continue type: ${user?.email}`">
          <UInput
            v-model="deleteConfirmationInput"
            name="deleteConfirmationInput"
            placeholder="Type your email here"
            icon="i-heroicons-shield-check"
          />
        </UInputGroup>
        <!-- errors -->
        <div>
          <UBadge
            v-if="deleteConfirmationInput?.length && deleteConfirmationInput !== user?.email"
            color="red"
            variant="solid"
            class="mt-2"
          >
            Email does not match
          </UBadge>
          <UBadge v-if="errorMsg?.length" color="red" variant="solid" class="mt-1">
            {{ errorMsg }}
          </UBadge>
        </div>
      </div>
    </AppConfirm>
  </UModal>
</template>
<script setup lang="ts">
  import { User, deleteUser, getAuth, updateProfile } from 'firebase/auth';
  import { useGeneralStore } from '~/stores/general';
  import { Blog, FirestoreUser } from '~/types';

  definePageMeta({
    middleware: ['auth'],
  });
  const apiConfig = useAppConfig();
  const router = useRouter();
  const route = useRoute();
  const generalStore = useGeneralStore();
  const toast = useToast();
  const auth = getAuth();

  const loading = ref(false);
  const db = useFirestore();
  const user = useCurrentUser();
  const myProfile = computed(() => Generics.valuesMatch(user.value?.uid, route.params?.uid));
  const foreignUser = ref<FirestoreUser>();

  const profileUser = computed(() => (myProfile.value ? user.value : foreignUser.value));

  const myBlogs = ref<Blog[]>();

  const newPic = ref(''); // new profile picture to solve having to reload the page to see the new profile picture issue
  const userPic = computed(
    () =>
      newPic.value ||
      profileUser.value?.photoURL ||
      'https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-6299533-5187865.png'
  );
  const updateProfileDialog = ref(false);
  const toggleUpdateProfileDialog = (state: boolean) => {
    updateProfileDialog.value = [true, false].includes(state) ? state : !updateProfileDialog.value;
  };

  const updateUserForm = ref({
    photoURL: '',
    displayName: '',
  });

  const avatars = computed<string[]>(() => generalStore.avatars);

  // select avatar
  const selectAvatar = (avatar: string) => {
    updateUserForm.value.photoURL = avatar;
  };

  const isAvatarSelected = (avatar: string) => {
    return avatar === updateUserForm.value.photoURL;
  };

  const changePicHint = computed(() => {
    return updateUserForm.value.photoURL?.length && !validateUrl(updateUserForm.value.photoURL)
      ? 'invalid image url'
      : 'This is the only way available yet to update your profile picture. get your image url from any site you uploaded it on before.';
  });

  const updateProfileFormValid = computed(() => {
    return updateUserForm.value.photoURL?.length && updateUserForm.value.displayName?.length;
  });

  const updatingProfile = ref(false);

  const updateUserProfile = async () => {
    updatingProfile.value = true;
    const { photoURL, displayName } = updateUserForm.value;
    updateProfile(auth.currentUser as User, {
      displayName,
      photoURL,
    })
      .then(async () => {
        const db = useFirestore();
        await updateFirestoreUser(db, {
          uid: auth.currentUser?.uid as string,
          displayName,
          photoURL,
        });
        newPic.value = photoURL;
        toast.add({ title: 'Profile updated successfully' });
        toggleUpdateProfileDialog(false);
      })
      .catch((error) => {
        throw createError({
          message: error.message,
          statusCode: 500,
        });
      })
      .finally(() => {
        updatingProfile.value = false;
      });
  };

  // delete account
  const confirmDeletionDialog = ref(false);
  const deletingUser = ref(false);
  const deleteConfirmationInput = ref<string>();
  const errorMsg = ref<string>();

  const confirmDeleteUser = async () => {
    deletingUser.value = false;
    await deleteFirestoreUser(db, {
      uid: auth.currentUser?.uid as string,
    })
      .then(async () => {
        await deleteUser(auth.currentUser as User)
          .then(async () => {
            await auth.signOut();
            router.push('/');
            toast.add({ title: 'Logged out successfully' });
            confirmDeletionDialog.value = false;
          })
          .catch((error) => {
            // An error ocurred
            errorMsg.value = error.message;
            throw createError({
              message: error.message,
              statusCode: 500,
            });
          });
      })
      .finally(() => {
        deletingUser.value = false;
      });
  };

  onMounted(() => {
    updateUserForm.value.photoURL = userPic.value || '';
    updateUserForm.value.displayName = user.value?.displayName || '';
  });
  onBeforeMount(async () => {
    if (!myProfile.value) {
      loading.value = true;
      foreignUser.value = await getFirestoreUser(db, route.params?.uid as string).finally(() => {
        loading.value = false;
      })!;
    }
  });

  watchEffect(async () => {
    myBlogs.value = (await BlogHandler.getUserBlogs(user.value?.uid as string)) as Blog[];
  });
  //TODO:: add verification email cycle
  //TODO:: add password reset cycle
</script>
