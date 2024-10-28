import { Item, Media, Page, Section } from '@/application/entities';
import {
  GetPageResponse,
  ItemSchema,
  PageSchema,
  SectionSchema
} from '../entities';

export type UpdatePageRequest = {
  id: string;
  data: PageSchema;
};

export type UpdateSectionRequest = {
  id: string;
  data: SectionSchema;
};

export type UpdateItemRequest = {
  id: string;
  data: ItemSchema;
};

export default abstract class PageRepository {
  abstract getPage(slug: string): Promise<GetPageResponse>;
  abstract addPage(page: PageSchema): Promise<GetPageResponse>;
  abstract getPagesByUser(userId: string): Promise<Page[]>;
  abstract getPageById(id: string): Promise<Page>;
  abstract updatePage(props: UpdatePageRequest): Promise<Page>;
  abstract updateSection(props: UpdateSectionRequest): Promise<Section>;
  abstract createItem(props: ItemSchema): Promise<Item>;
  abstract updateItem(props: UpdateItemRequest): Promise<void>;
  abstract deleteItem(id: string): Promise<void>;
  abstract updatePublishedStateItem(
    id: string,
    state: Date | null
  ): Promise<void>;
  abstract updatePublishedStateSection(
    id: string,
    state: Date | null
  ): Promise<void>;
  abstract uploadMedia(media: File): Promise<Media>;
}
