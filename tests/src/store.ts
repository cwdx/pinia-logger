import { defineStore } from "pinia";

interface State {
  messages: string[];
}

export const useStore = defineStore("main", {
  state: (): State => ({
    messages: []
  }),
  actions: {
    ADD_MESSAGE(value: string) {
      this.messages = [value, ...this.messages];
    },
    ADD_ASYNC_MESSAGE(value: string) {
      return new Promise(res => {
        setTimeout(() => {
          this.messages = [value, ...this.messages];
          res(true);
        },100)
      })
    },
    MOCK_ERROR() {
      return new Promise((_, rej) => {
        setTimeout(() => {
          rej(false);
        },100)
      })
    },
  }
})