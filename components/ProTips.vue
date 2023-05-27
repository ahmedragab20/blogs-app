<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Action</th>
          <th scope="col" class="px-6 py-3">Shortcut</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            App Settings
          </th>
          <td class="px-6 py-4">
            <div class="flex items-center gap-0.5">
              <UKbd>{{ metaSymbol }}</UKbd>
              <UKbd>.</UKbd>
            </div>
          </td>
        </tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Go To Profile
          </th>
          <td class="px-6 py-4">
            <UKbd>P</UKbd>
          </td>
        </tr>

        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Add Blog
          </th>
          <td class="px-6 py-4">
            <UKbd>N</UKbd>
          </td>
        </tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            About the developer <UBadge size="xs">me😁</UBadge>
          </th>
          <td class="px-6 py-4">
            <UKbd>I</UKbd>
          </td>
        </tr>
        <tr class="bg-white dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Pro Tips
          </th>
          <td class="px-6 py-4">
            <UKbd>/</UKbd>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  const { metaSymbol } = useShortcuts();
</script>
