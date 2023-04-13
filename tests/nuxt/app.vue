<script lang="ts" setup>
import { useCounterSetupStore } from "~/stores/main";

const store = useCounterSetupStore();
</script>

<template>
  <div>
    {{ store.count }}
    <button @click="store.increment">+</button>
    <button @click="store.decrement">-</button>
  </div>
</template>
