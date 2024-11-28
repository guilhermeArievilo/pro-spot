import { Page } from '@/application/entities';
import { create } from 'zustand';
import useUserStore from './uset';
import usePageModel from '@/application/modules/pages/presentation/models/page-model';
import BackendUserRepository from '@/infra/http/backend/user/repository/backend-user-repository';
import axiosInstance from '@/infra/http/axiosService';
import BackendPagesRepository from '@/infra/http/backend/pages/repository/backend-pages-repository';

interface PageStore {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  fetchPages: () => Promise<void>;
  addPage: (page: Page) => void;
  pageSelected: Page | undefined;
  setSelectedPage: (page: Page | undefined) => void;
  refreshSelectedPage: () => Promise<void>;
}

const usePagesStore = create<PageStore>((set, get) => ({
  pageSelected: undefined,
  setSelectedPage: (page: Page | undefined) =>
    set((state) => ({
      ...state,
      pageSelected: page
    })),
  refreshSelectedPage: async () => {
    const { isAuthenticated, jwtToken } = useUserStore.getState();
    const id = get().pageSelected?.id;
    if (!isAuthenticated && !jwtToken && id) return;

    const pageRepository = new BackendPagesRepository(axiosInstance, jwtToken);
    const { fetchPageById } = usePageModel({ pageRepository });

    const page = await fetchPageById(id!);

    set({
      pageSelected: page ? page : undefined
    });
  },
  pages: [],
  setPages: (pages: Page[]) =>
    set({
      pages
    }),
  addPage: (page: Page) =>
    set((state) => ({
      pages: [...state.pages, page]
    })),
  fetchPages: async () => {
    const { isAuthenticated, jwtToken } = useUserStore.getState();
    if (!isAuthenticated && !jwtToken) return;

    const pageRepository = new BackendPagesRepository(axiosInstance, jwtToken);
    const { fetchPagesByUserId } = usePageModel({ pageRepository });

    const pages = await fetchPagesByUserId('');
    set({
      pages
    });
  }
}));

export default usePagesStore;
