import { Page } from '@/application/entities';
import { create } from 'zustand';

interface PageStore {
  pages: Page[];
  pageSelected: Page | undefined;
  setSelectedPage: (page: Page | undefined) => void;
  setPages: (pages: Page[]) => void;
  addPage: (page: Page) => void;
}

const usePagesStore = create<PageStore>((set) => ({
  pageSelected: undefined,
  setSelectedPage: (page: Page | undefined) =>
    set((state) => ({
      ...state,
      pageSelected: page
    })),
  pages: [],
  setPages: (pages: Page[]) =>
    set({
      pages
    }),
  addPage: (page: Page) =>
    set((state) => ({
      pages: [...state.pages, page]
    }))
}));

export default usePagesStore;
