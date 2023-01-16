<template>
  <h1>Pinia Logger Test</h1>
  <form @submit.prevent="submit">
    <input v-model="form" placeholder="Set message" />
    <label> <input type="checkbox" v-model="promise" />async </label>

    <button type="submit">Add Message</button>
    <button type="button" @click="mainStore.mockError()">Mock Error</button>
  </form>
  <div class="counter">
    Count: {{ mainStore.count }}
    <button @click="mainStore.incrementCounter">increment</button>
  </div>
  <div v-for="(msg, i) of mainStore.messages" :key="i" class="msg">
    {{ msg }}
  </div>

  <h2>Test store with custom `logger` options</h2>
  Count: {{ counterSetupStore.count }}<br />
  <button @click="counterSetupStore.increment">+</button>
  <button @click="counterSetupStore.decrement">-</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useMainStore } from "./store/main";
import { useCounterSetupStore } from "./store/counter-setup";

const mainStore = useMainStore();
const counterSetupStore = useCounterSetupStore();
const form = ref("Test message");
const promise = ref(false);

const submit = () => {
  if (!form.value) return;
  if (promise.value) {
    mainStore.addAsyncMessage(form.value);
  } else {
    mainStore.addMessage(form.value);
  }
};
</script>

<style>
:root {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

h1 {
  font-weight: 300;
  font-size: 2rem;
}

form {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

input,
label,
button {
  margin-right: 0.5rem;
  font: inherit;
}

.msg,
.counter {
  border: 1px solid lightgray;
  margin-bottom: 1rem;
  border-radius: 5px;
  padding: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.counter button {
  margin-left: auto;
}
</style>
