import { create } from 'zustand'

const useBookStore = create((set) => ({
  selectedBook: null,
  shouldRefresh: false,
  bookHistory: [], // Neue Historie
  
  setSelectedBook: (book) => set((state) => ({
    selectedBook: book,
    bookHistory: [...state.bookHistory, book] // Füge neues Buch zur Historie hinzu
  })),
  
  setShouldRefresh: (value) => set({ shouldRefresh: value }),
  
  removeLastBook: () => set((state) => {
    const newHistory = state.bookHistory.slice(0, -1); // Entferne letztes Buch
    return {
      bookHistory: newHistory,
      selectedBook: newHistory[newHistory.length - 1] || null // Setze vorheriges Buch oder null
    };
  })
}));

export default useBookStore;
