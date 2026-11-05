<script setup lang="ts">
const { $hello, $router } = useNuxtApp();
const greeting: string = $hello("pinia");
const path: string = $router.currentRoute.value.path;
</script>

<template>
  <p>{{ greeting }} {{ path }}</p>
</template>
