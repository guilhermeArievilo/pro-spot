import { PageSchema } from '../entities';
import PageRepository from '../repository/page-repository';

interface UpdatePageUsecaseResponse {
  status: 'success' | 'error';
}

export default class UpdatePageUsecase {
  constructor(private repository: PageRepository) {}

  async execute({
    id,
    data
  }: {
    id: string;
    data: PageSchema;
  }): Promise<UpdatePageUsecaseResponse> {
    try {
      await this.repository.updatePage({
        id,
        data
      });

      return {
        status: 'success'
      };
    } catch (e) {
      console.error(e);
      return {
        status: 'error'
      };
    }
  }
}
