import { Item, Page } from '@/application/entities';
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
  abstract updatePage(props: UpdatePageRequest): Promise<void>;
  abstract updateSection(props: UpdateSectionRequest): Promise<void>;
  abstract updateItem(props: UpdateItemRequest): Promise<void>;
  abstract createItem(props: ItemSchema): Promise<Item>;
}
