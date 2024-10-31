import { Section } from '@/application/entities';
import { SectionSchema } from '../entities';
import PageRepository from '../repository/page-repository';

export default class UpdateSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute({
    id,
    data
  }: {
    id: string;
    data: SectionSchema;
  }): Promise<Section> {
    const section = await this.repository.updateSection({
      id,
      data
    });

    return section;
  }
}
