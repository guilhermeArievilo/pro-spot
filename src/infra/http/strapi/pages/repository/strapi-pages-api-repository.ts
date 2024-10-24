import {
  GetPageResponse,
  ItemSchema,
  PageSchema
} from '@/application/modules/pages/entities';
import PageRepository, {
  UpdateItemRequest,
  UpdatePageRequest,
  UpdateSectionRequest
} from '@/application/modules/pages/repository/page-repository';
import { ApolloClient, gql } from '@apollo/client';
import {
  RemotePage,
  toPageDomain,
  toPageItemDomain,
  toSectionPageDomain
} from '../mappers';
import { AxiosInstance } from 'axios';
import { Item, Page, Section } from '@/application/entities';

export default class StrapiPagesApiRepository implements PageRepository {
  constructor(
    private ApolloClientService: ApolloClient<any>,
    private AxiosClientService: AxiosInstance
  ) {}

  private getPageByIdQuery = gql`
    query Page($documentId: ID!) {
      page(documentId: $documentId) {
        name
        slug
        documentId
        content
        photoProfile {
          documentId
          url
          width
          height
          mime
          alternativeText
        }
        backgroundMedia {
          documentId
          width
          url
          height
          mime
          alternativeText
        }
        facebook
        instagram
        linkedin
        createdAt
        x
        whatsapp
        updatedAt
        section_pages {
          documentId
          alignContent
          createdAt
          page_items {
            documentId
            createdAt
            image {
              documentId
              width
              url
              height
              mime
              alternativeText
            }
            link
            subtitle
            title
            type
            updatedAt
          }
          title
          subtitle
          updatedAt
          publishedAt
        }
        page_items {
          documentId
          createdAt
          image {
            documentId
            width
            url
            height
            mime
            alternativeText
          }
          link
          subtitle
          title
          type
          updatedAt
        }
        publishedAt
      }
    }
  `;

  async getPageById(id: string): Promise<Page> {
    const { data, error } = await this.ApolloClientService.query({
      query: this.getPageByIdQuery,
      variables: {
        documentId: id
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.page) {
      throw new Error('Page not found');
    }

    return toPageDomain(data.page);
  }

  async getPagesByUser(userId: string): Promise<Page[]> {
    const query = gql`
      query Query($documentId: ID!) {
        appUser(documentId: $documentId) {
          pages {
            documentId
            name
            content
            createdAt
            facebook
            instagram
            linkedin
            slug
            whatsapp
            x
            updatedAt
            backgroundMedia {
              documentId
              url
              width
              height
              mime
              alternativeText
            }
            photoProfile {
              documentId
              url
              width
              height
              mime
              alternativeText
            }
          }
        }
      }
    `;

    const { data, error } = await this.ApolloClientService.query({
      query,
      variables: {
        documentId: userId
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.appUser?.pages.length) {
      throw new Error('Pages not found');
    }

    return data.appUser.pages.map((page: RemotePage) => toPageDomain(page));
  }

  addPage(page: PageSchema): Promise<GetPageResponse> {
    throw new Error('Method not implemented.');
  }

  async getPage(slug: string): Promise<GetPageResponse> {
    const query = gql`
      query Pages($filters: PageFiltersInput) {
        pages(filters: $filters) {
          name
          content
          documentId
          slug
          backgroundMedia {
            documentId
            url
            width
            height
            mime
            alternativeText
          }
          photoProfile {
            documentId
            url
            width
            height
            mime
            alternativeText
          }
          facebook
          instagram
          linkedin
          locale
          whatsapp
          section_pages {
            documentId
            title
            subtitle
            alignContent
            page_items {
              title
              subtitle
              link
              documentId
              type
              image {
                documentId
                mime
                height
                url
                width
              }
            }
          }
          page_items {
            title
            subtitle
            link
            documentId
            type
            image {
              documentId
              mime
              height
              url
              width
            }
          }
        }
      }
    `;

    const { data, error } = await this.ApolloClientService.query({
      query,
      variables: {
        filters: {
          slug: {
            eq: slug
          }
        }
      },
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.pages?.length) {
      throw new Error('Page not found');
    }

    return toPageDomain(data.pages[0]);
  }

  async updatePage({ id, data }: UpdatePageRequest): Promise<Page> {
    const {
      slug,
      name,
      content,
      instagram,
      x,
      linkedin,
      locationLink,
      facebook,
      whatsapp,
      backgroundMedia,
      photoProfile,
      items,
      sections
    } = data;

    const bodyData = {
      slug,
      name,
      content,
      instagram,
      x,
      linkedin,
      locationLink,
      facebook,
      whatsapp
    };

    if (items?.length) {
      Object.assign(bodyData, {
        page_items: {
          set: items
        }
      });
    }

    if (sections?.length) {
      Object.assign(bodyData, {
        section_pages: {
          set: sections
        }
      });
    }

    if (backgroundMedia && backgroundMedia instanceof File) {
      const mediaId = await this.updateFile({
        file: backgroundMedia,
        refId: id,
        field: 'backgroundMedia',
        ref: 'api::page.page'
      });

      Object.assign(bodyData, {
        backgroundMedia: {
          set: [mediaId]
        }
      });
    }

    if (photoProfile && photoProfile instanceof File) {
      const mediaId = await this.updateFile({
        file: photoProfile,
        refId: id,
        field: 'photoProfile',
        ref: 'api::page.page'
      });

      Object.assign(bodyData, {
        photoProfile: {
          set: [mediaId]
        }
      });
    }

    const result = await this.AxiosClientService.put(`/pages/${id}`, {
      data: bodyData
    }).then(async () => {
      const { data: pageData, error } = await this.ApolloClientService.query({
        query: this.getPageByIdQuery,
        variables: {
          documentId: id
        }
      });

      return pageData;
    });

    if (!result?.page) {
      throw new Error('Could not find page');
    }

    return toPageDomain({
      ...result.page
    });
  }

  async updateSection({ id, data }: UpdateSectionRequest): Promise<Section> {
    // /api/section-pages/:id

    const bodyData = {
      title: data.title,
      subtitle: data.subtitle,
      alignContent: data.alignContent
    };

    if (data.items?.length) {
      Object.assign(bodyData, {
        page_items: {
          set: data.items.map((id) => ({
            documentId: id
          }))
        }
      });
    }

    const result = await this.AxiosClientService.put(`/section-pages/${id}`, {
      data: bodyData
    });

    if (!result?.data) {
      throw new Error('Page not updated');
    }

    return toSectionPageDomain(result.data.data);
  }

  async createItem({
    title,
    type,
    subtitle,
    link,
    image
  }: ItemSchema): Promise<Item> {
    // /api/page-items
    const bodyData = {
      title,
      subtitle,
      type,
      link
    };

    if (image && image instanceof File) {
      const mediaId = await this.updateFile({
        file: image
      });

      Object.assign(bodyData, {
        image: {
          set: [mediaId]
        }
      });
    }

    const result = await this.AxiosClientService.post(`/page-items`, {
      data: bodyData
    });

    if (!result.data) {
      throw new Error('Page not created');
    }

    return toPageItemDomain(result.data.data);
  }

  async updateItem({ id, data }: UpdateItemRequest): Promise<void> {
    // /api/page-items/:id

    const bodyData = {
      title: data.title,
      subtitle: data.subtitle,
      link: data.link,
      type: data.type
    };

    if (data.image && data.image instanceof File) {
      const mediaId = await this.updateFile({
        file: data.image,
        refId: id,
        field: 'image',
        ref: 'api::page-items.page-items'
      });

      Object.assign(bodyData, {
        image: {
          set: [mediaId]
        }
      });
    }

    const result = await this.AxiosClientService.put(`/page-items/${id}`, {
      data: bodyData
    });

    if (!result?.data) {
      throw new Error('Page not updated');
    }
  }

  async deleteItem(id: string): Promise<void> {
    // /api/page-items/:id
    await this.AxiosClientService.delete(`/page-items/${id}`);
  }

  async updateFile({
    file,
    refId,
    field,
    ref
  }: {
    file: File;
    refId?: string;
    field?: string;
    ref?: string;
  }) {
    const uploadFormData = new FormData();
    uploadFormData.append('files', file);
    // uploadFormData.append('ref', ref);
    // uploadFormData.append('refId', refId);
    // uploadFormData.append('field', field);

    const result: any = await this.AxiosClientService.post(
      '/upload',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (!result?.data) throw new Error('Error on upload media !');

    return result.data[0].id;
  }
}
