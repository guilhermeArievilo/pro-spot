import { SectionSchema } from '../entities';
import PageRepository from '../repository/page-repository';

interface UpdateSectionUsecaseResponse {
  status: 'success' | 'error';
}

export default class UpdateSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute({
    id,
    data
  }: {
    id: string;
    data: SectionSchema;
  }): Promise<UpdateSectionUsecaseResponse> {
    try {
      await this.repository.updateSection({
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
