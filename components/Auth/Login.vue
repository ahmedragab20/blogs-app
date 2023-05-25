<template>
  <div>
    <!-- form -->
    <form @submit.prevent="submitLogin">
      <div>
        <UInput
          v-model="form.email"
          placeholder="you@example.com"
          name="login"
          icon="i-heroicons-envelope"
          type="email"
          class="mb-1"
        />
        <div class="relative">
          <UInput
            v-model="form.password"
            placeholder="Password"
            name="login"
            icon="i-heroicons-lock-closed"
            :type="showPassword ? 'text' : 'password'"
          />
          <div
            class="absolute right-0 top-0 bottom-0 flex items-center cursor-pointer"
            @click="showPassword = !showPassword"
          >
            <UButton
              :icon="showPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              variant="ghost"
              color="transparent"
            />
          </div>
        </div>

        <UButton type="submit" class="mt-4" color="primary"> Login </UButton>
        <template v-if="!!errorObj?.code || !!errorObj?.message || true">
          <div class="mt-3">
            <UBadge color="red" icon="i-heroicons-exclamation-circle">
              <!-- {{ errorObj!.message }} -->
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit, perferendis.
            </UBadge>
            <div class="my-1"></div>
            <UBadge color="red" icon="i-heroicons-exclamation-circle">
              <!-- {{ errorObj!.message }} -->
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit, perferendis.
            </UBadge>
          </div>
        </template>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  interface Form {
    email: string;
    password: string;
  }
  interface Error {
    code: number;
    message: string;
  }

  const emit = defineEmits<{
    success: [done: boolean];
  }>();

  const auth = getAuth();

  const showPassword = ref<boolean>(false);

  const form = ref<Form>({
    email: '',
    password: '',
  });

  const errorObj = ref<Partial<Error>>();
  const loading = ref<boolean>(false);

  const submitLogin = async () => {
    try {
      loading.value = true;
      const { email, password } = form.value;
      await signInWithEmailAndPassword(auth, email, password);

      errorObj.value = {};
      emit('success', true);
    } catch (error: any) {
      errorObj.value!.code = error.code;
      errorObj.value!.message = error.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * TODO:: Email & Password Validation
   * TODO:: display error message [email, password, both together]
   * TODO:: display loading spinner
   * TODO:: display success message
   * TODO:: redirect to home page
   */
</script>
