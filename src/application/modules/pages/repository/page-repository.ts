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
  abstract getPagesByUser(userId: string): Promise<Page[]>;
  abstract getPageById(id: string): Promise<Page>;
  abstract createPage(page: PageSchema, userid: string): Promise<Page>;
  abstract updatePage(props: UpdatePageRequest): Promise<Page>;
  abstract deletePage(pageId: string): Promise<void>;
  abstract createSection(section: SectionSchema): Promise<Section>;
  abstract updateSection(props: UpdateSectionRequest): Promise<Section>;
  abstract deleteSection(id: string): Promise<void>;
  abstract createItem(props: ItemSchema): Promise<Item>;
  abstract updateItem(props: UpdateItemRequest): Promise<Item>;
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
