import PageRepository from '../repository/page-repository';

interface PublishPageUsecaseResponse {
  publishedAt: Date;
}

export default class PublishPageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<PublishPageUsecaseResponse> {
    const atualDate = new Date();
    await this.repository.updatePublishedStatePage(id, atualDate);

    return {
      publishedAt: atualDate
    };
  }
}
