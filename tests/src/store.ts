import { defineStore } from "pinia";

interface State {
  messages: string[];
  count: number;
}

export const useStore = defineStore("main", {
  state: (): State => ({
    messages: [],
    count: 0,
  }),
  actions: {
    addMessage(value: string) {
      this.messages = [value, ...this.messages];
    },
    addAsyncMessage(value: string) {
      return new Promise((res) => {
        setTimeout(() => {
          this.messages = [value, ...this.messages];
          res(true);
        }, 100);
      });
    },
    mockError() {
      return new Promise((_, rej) => {
        setTimeout(() => {
          rej(false);
        }, 100);
      });
    },
    incrementCounter() {
      this.count++;
    },
  },
});
