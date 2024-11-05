import PageRepository from '../repository/page-repository';

interface UnpublishPageUsecaseResponse {
  publishedAt: null;
}

export default class UnpublishPageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<UnpublishPageUsecaseResponse> {
    await this.repository.updatePublishedStatePage(id, null);

    return {
      publishedAt: null
    };
  }
}
