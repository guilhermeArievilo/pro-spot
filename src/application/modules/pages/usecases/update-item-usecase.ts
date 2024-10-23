import { ItemSchema } from '../entities';
import PageRepository from '../repository/page-repository';

interface UpdateItemUsecaseResponse {
  status: 'success' | 'error';
}

export default class UpdateItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute({
    id,
    data
  }: {
    id: string;
    data: ItemSchema;
  }): Promise<UpdateItemUsecaseResponse> {
    try {
      await this.repository.updateItem({
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
