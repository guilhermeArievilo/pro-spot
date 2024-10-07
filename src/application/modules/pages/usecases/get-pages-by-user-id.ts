import { Page } from '@/application/entities';
import PageRepository from '../repository/page-repository';

export default class GetPagesByUserId {
  constructor(private repository: PageRepository) {}

  async execute(userId: string): Promise<Page[] | null> {
    try {
      const result = await this.repository.getPagesByUser(userId);

      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
