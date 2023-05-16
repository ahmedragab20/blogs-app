<template>
  <div class="flex justify-center items-center min-h-screen">
    <h1 class="dark:text-white">Home</h1>
  </div>
</template>

<script setup lang="ts">
  interface Skill {
    id: string;
    name: string;
    date_updated: string | null;
    years_of_experience: number;
  }

  const config = useRuntimeConfig();

  const colorMode = useColorMode();
  console.log(colorMode.preference);

  const skills = ref<Skill[]>([]);
  const fetchData = async () => {
    const { data }: any = await useFetch(`${config.public.baseURL}/Skills`);
    return data.value?.data;
  };

  onMounted(async () => {
    await fetchData().then((data) => {
      skills.value = data;
    });

    console.log(getCurrentUser);
  });
</script>
