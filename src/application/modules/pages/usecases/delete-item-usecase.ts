import PageRepository from '../repository/page-repository';

interface DeleteItemUsecaseResponse {
  status: 'success' | 'error';
}

export default class DeleteItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<DeleteItemUsecaseResponse> {
    try {
      await this.repository.deleteItem(id);

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
