import { defineStore } from "pinia";

export const useCounterSetupStore = defineStore("counter-setup", {
  actions: {
    decrement() {
      this.count--;
    },
    increment() {
      this.count++;
    },
  },
  state: () => ({
    count: 0,
  }),
});

export default useCounterSetupStore;
