import { ref } from 'vue'

const currentStore = ref(null)

export const switchStore = (store) => {
  currentStore.value = store
}

export { currentStore }