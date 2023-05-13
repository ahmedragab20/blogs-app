<template>
  <div class="h-screen flex justify-center items-center flex-col w-full">
    <div class="flex p-3 border rounded-lg dark:bg-slate-500 dark:text-white sepia:bg-red-100">
      <pre>
        <code>
          {{ skills }}
        </code>
      </pre>
    </div>
    <div v-for="skill in skills">
      {{ skill.name }}
    </div>
    <div>
      <h1>Color mode: {{ $colorMode.value }}</h1>
      <select v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
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
    skills.value = data.value?.data;
  };

  onMounted(async () => {
    await fetchData();
  });
</script>
