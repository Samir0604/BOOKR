// stores/bookStore.js
import { create } from 'zustand'

const useBookStore = create((set) => ({
  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),
  resetBook: () => set({ selectedBook: null })
}))

export default useBookStore
