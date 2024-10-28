import PageRepository from '../repository/page-repository';

interface UnpublishItemUsecaseResponse {
  publishedAt: null;
}

export default class UnpublishItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<UnpublishItemUsecaseResponse> {
    await this.repository.updatePublishedStateItem(id, null);

    return {
      publishedAt: null
    };
  }
}
