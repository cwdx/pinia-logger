export default defineNuxtPlugin(() => ({ provide: { hello: (name: string) => `hello ${name}` } }));
