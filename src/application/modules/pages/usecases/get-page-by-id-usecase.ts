import PageRepository from '../repository/page-repository';

export default class GetPageByIdUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string) {
    try {
      const page = await this.repository.getPageById(id);
      return page;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
