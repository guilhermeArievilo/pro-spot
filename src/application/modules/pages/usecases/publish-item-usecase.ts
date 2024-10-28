import PageRepository from '../repository/page-repository';

interface PublishItemUsecaseResponse {
  publishedAt: Date;
}

export default class PublishItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<PublishItemUsecaseResponse> {
    const atualDate = new Date();
    await this.repository.updatePublishedStateItem(id, atualDate);

    return {
      publishedAt: atualDate
    };
  }
}
