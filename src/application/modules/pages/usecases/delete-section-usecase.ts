import PageRepository from '../repository/page-repository';

export default class DeleteSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.deleteSection(id);
  }
}
