import { GetPageResponse } from '../entities';
import PageRepository from '../repository/page-repository';

export default class GetPageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(slug: string): Promise<GetPageResponse | null> {
    try {
      const page = await this.repository.getPage(slug);

      return page;
    } catch (e: any) {
      console.log(e);
      return null;
    }
  }
}
