import PageRepository from '../repository/page-repository';

interface PublishSectionUsecaseResponse {
  publishedAt: Date;
}

export default class PublishSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<PublishSectionUsecaseResponse> {
    const atualDate = new Date();
    await this.repository.updatePublishedStateSection(id, atualDate);

    return {
      publishedAt: atualDate
    };
  }
}
