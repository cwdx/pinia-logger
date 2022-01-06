<template>
    <h1>Pinia Logger Test</h1>
    <form @submit.prevent="submit">
        <input v-model="form" placeholder="Set message" />
        <input type="checkbox" v-model="promise" />

        <button type="submit">Add Message</button>
        <button type="button" @click="store.MOCK_ERROR">Mock Error</button>
    </form>
    <div v-for="(msg, i) of store.messages" :key="i" class="msg">{{ msg }}</div>
</template>

<script lang="ts" setup>import { ref } from 'vue';
import { useStore } from './store';

const store = useStore();
const form = ref("");
const promise = ref(false);

const submit = () => {
    if (!form.value) return;
    if (promise.value) {
        store.ADD_ASYNC_MESSAGE(form.value);
    } else {
        store.ADD_MESSAGE(form.value);
    }
    form.value = '';
}
</script>

<style>
:root {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 1rem;
}

h1 {
    font-weight: 300;
    font-size: 2rem;
}

form {
    margin-bottom: 1.5rem;
}

.msg {
    border: 1px solid lightgray;
    margin-bottom: 1rem;
    border-radius: 5px;
    padding: 0.75rem;
}
</style>