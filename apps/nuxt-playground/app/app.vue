<script setup lang="ts">
const useCounter = defineStore("counter", {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
const counter = useCounter();
onMounted(() => counter.increment());
</script>

<template>
  <button @click="counter.increment()">count {{ counter.count }}</button>
</template>
