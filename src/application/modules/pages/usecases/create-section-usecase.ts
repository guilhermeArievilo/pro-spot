import { Section } from '@/application/entities';
import { SectionSchema } from '../entities';
import PageRepository from '../repository/page-repository';

export default class CreateSectionUsecase {
  constructor(private repository: PageRepository) {}

  async execute(section: SectionSchema): Promise<Section> {
    const createdSection = await this.repository.createSection(section);
    return createdSection;
  }
}
