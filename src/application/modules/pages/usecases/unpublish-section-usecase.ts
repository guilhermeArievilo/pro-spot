import PageRepository from '../repository/page-repository';

interface UnpublishSectionUsecaseResponse {
  publishedAt: null;
}

export default class UnpublishSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<UnpublishSectionUsecaseResponse> {
    await this.repository.updatePublishedStateSection(id, null);

    return {
      publishedAt: null
    };
  }
}
