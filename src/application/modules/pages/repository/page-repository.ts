import { Page } from '@/application/entities';
import { GetPageResponse, PageSchema } from '../entities';

export type UpdatePageRequest = {
  data: PageSchema;
  id: string;
};

export default abstract class PageRepository {
  abstract getPage(slug: string): Promise<GetPageResponse>;
  abstract addPage(page: PageSchema): Promise<GetPageResponse>;
  abstract getPagesByUser(userId: string): Promise<Page[]>;
  abstract getPageById(id: string): Promise<Page>;
  abstract updatePage(props: UpdatePageRequest): Promise<void>;
}
