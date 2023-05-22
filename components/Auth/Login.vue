<template>
  <div>
    <!-- form -->
    <form
      @submit.prevent="submitLogin"
      class="p-5 mb-5 bg-white border rounded-xl dark:bg-gray-800"
    >
      <div>
        <UInputGroup label="Login" hint="Required" required>
          <UInput
            v-model="form.email"
            placeholder="you@example.com"
            name="login"
            icon="i-heroicons-envelope"
            type="email"
          />
          <UInput
            v-model="form.password"
            class="mt-1 mb-3"
            placeholder="Password"
            name="login"
            icon="i-heroicons-lock-closed"
            type="password"
          />
          <UButton type="submit" class="" color="primary"> Login </UButton>
        </UInputGroup>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  const user = await getCurrentUser();

  interface Form {
    email: string;
    password: string;
  }

  const auth = getAuth();

  const form = ref<Form>({
    email: '',
    password: '',
  });

  const submitLogin = async () => {
    const { email, password } = form.value;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log({ userCredential });
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
</script>
