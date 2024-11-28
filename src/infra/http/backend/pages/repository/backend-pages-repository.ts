import { Page, Section, Item, Media } from '@/application/entities';
import {
  GetPageResponse,
  PageSchema,
  SectionSchema,
  ItemSchema
} from '@/application/modules/pages/entities';
import PageRepository, {
  UpdateItemRequest,
  UpdatePageRequest,
  UpdateSectionRequest
} from '@/application/modules/pages/repository/page-repository';
import { AxiosInstance } from 'axios';
import {
  BackendItem,
  BackendPage,
  BackendSection
} from '../etities/backend-pages-entities';
import {
  toDomainItem,
  toDomainPage,
  toDomainSection
} from '../mappers/backend-page-mapper';
import { BackendMedia } from '../../shared/entities/backend-media-entities';
import { toMediaDomain } from '../../shared/mapper/backend-media-mapper';

export default class BackendPagesRepository implements PageRepository {
  private token: string | null = null;
  constructor(
    private AxiosClientService: AxiosInstance,
    token?: string
  ) {
    if (token) {
      this.token = token;
    }
  }

  getPage(slug: string): Promise<GetPageResponse> {
    throw new Error('Method not implemented.');
  }

  async getPagesByUser(userId: string): Promise<Page[]> {
    const pages = await this.AxiosClientService.get<BackendPage[]>(
      '/api/pages',
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!pages.data?.length) {
      throw new Error('Could not find pages for the user');
    }

    return pages.data.map(toDomainPage);
  }

  async getPageById(id: string): Promise<Page> {
    const page = await this.AxiosClientService.get<BackendPage>(
      `/api/page/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!page.data) {
      throw new Error('Could not find this page');
    }

    return toDomainPage(page.data);
  }

  async createPage(page: PageSchema, userid: string): Promise<Page> {
    const createdPage = await this.AxiosClientService.post<BackendPage>(
      `/api/page`,
      {
        ...page
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!createdPage.data) {
      throw new Error('Could not create this page');
    }

    return toDomainPage(createdPage.data);
  }

  async updatePage({ id, data }: UpdatePageRequest): Promise<Page> {
    const createdPage = await this.AxiosClientService.put<BackendPage>(
      `/api/page/${id}`,
      {
        ...data
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!createdPage.data) {
      throw new Error('Could not create this page');
    }

    return toDomainPage(createdPage.data);
  }

  async deletePage(pageId: string): Promise<void> {
    await this.AxiosClientService.delete(`/api/page/${pageId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  async updatePublishedStatePage(
    id: string,
    state: Date | null
  ): Promise<void> {
    await this.AxiosClientService.put<BackendPage>(
      `/api/page/${state ? 'publish' : 'un-publish'}/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );
  }

  async addViewToPage(slug: string): Promise<void> {
    await this.AxiosClientService.put<BackendPage>(
      `/api/page/add-view/${slug}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );
  }

  async createSection(section: SectionSchema): Promise<Section> {
    const createdSection = await this.AxiosClientService.post<BackendSection>(
      `/api/section`,
      {
        ...section
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!createdSection.data) {
      throw new Error('Could not create this section');
    }

    return toDomainSection(createdSection.data);
  }
  async updateSection({ id, data }: UpdateSectionRequest): Promise<Section> {
    const updatedSection = await this.AxiosClientService.put<BackendSection>(
      `/api/section/${id}`,
      {
        ...data
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!updatedSection.data) {
      throw new Error('Could not update this Section');
    }

    return toDomainSection(updatedSection.data);
  }
  async deleteSection(id: string): Promise<void> {
    await this.AxiosClientService.delete(`/api/section/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  async updatePublishedStateSection(
    id: string,
    state: Date | null
  ): Promise<void> {
    await this.AxiosClientService.put<BackendPage>(
      `/api/section/${state ? 'publish' : 'un-publish'}/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );
  }

  async createItem(props: ItemSchema): Promise<Item> {
    const createdItem = await this.AxiosClientService.post<BackendItem>(
      `/api/item`,
      {
        ...props
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!createdItem.data) {
      throw new Error('Could not create this item');
    }

    return toDomainItem(createdItem.data);
  }
  async updateItem({ id, data }: UpdateItemRequest): Promise<Item> {
    const updatedItem = await this.AxiosClientService.put<BackendItem>(
      `/api/item/${id}`,
      {
        ...data
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (!updatedItem.data) {
      throw new Error('Could not update this Section');
    }

    return toDomainItem(updatedItem.data);
  }
  async deleteItem(id: string): Promise<void> {
    await this.AxiosClientService.delete(`/api/item/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  async updatePublishedStateItem(
    id: string,
    state: Date | null
  ): Promise<void> {
    await this.AxiosClientService.put<BackendPage>(
      `/api/item/${state ? 'publish' : 'un-publish'}/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );
  }

  async uploadMedia(media: File): Promise<Media> {
    const uploadFormData = new FormData();
    uploadFormData.append('file', media);

    const result = await this.AxiosClientService.post<BackendMedia>(
      '/api/upload',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    return toMediaDomain(result.data);
  }

  setToken(token: string) {
    this.token = token;
  }
}
