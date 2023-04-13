import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterSetupStore = defineStore(
  "counter-setup",
  () => {
    const count = ref(0);
    const decrement = () => count.value--;
    const increment = () => count.value++;

    return {
      count,
      decrement,
      increment,
    };
  },
  {
    logger: {
      expanded: true,
      showTime: false,
      showStoreName: false,
      showPineapple: false,
      filter: (action) => action.name !== "increment",
      actions: ["decrement"],
    },
  }
);

export default useCounterSetupStore;
