import { create } from 'zustand'

const useBookStore = create((set) => ({
  selectedBook: null,
  // Home refresh states
  refreshHomeLikes: false, // wenn ich über [id] was like mache damit es im modal auch so ist
  refreshHomeActives: false,// wenn ich über [id] was active mache damit es im modal auch so ist
  refreshHomeBookProgress: false, // nur dass das active book in home angezeigt wird
  // Bibliothek refresh states
  refreshBib: false, // bib wird immer reloaded egal was das passt da so

  // Book history
  bookHistory: [],

  setSelectedBook: (book) => set((state) => ({
    selectedBook: book,
    bookHistory: [...state.bookHistory, book]
  })),

  // Home refresh setters
  setRefreshHomeLikes: (value) => set({ refreshHomeLikes: value }),
  setRefreshHomeActives: (value) => set({ refreshHomeActives: value }),
  setRefreshHomeBookProgress:  (value) => set({ refreshHomeBookProgress: value }),
  // Bibliothek refresh setters
  setRefreshBib: (value) => set({ refreshBib: value }),


  refreshAllLikes: () => set({
    refreshHomeLikes: true,
    refreshBib: true
  }),

  // Helper function to refresh all actives
  refreshAllActives: () => set({
    refreshHomeActives: true,
    refreshBib: true,
    refreshHomeBookProgress: true
  }),

  refreshBibAndBookProgress: () => set({
    refreshHomeBookProgress: true,
    refreshBib: true
  }),

  removeLastBook: () => set((state) => {
    const newHistory = state.bookHistory.slice(0, -1);
    return {
      bookHistory: newHistory,
      selectedBook: newHistory[newHistory.length - 1] || null
    };
  })
}));

export default useBookStore;
