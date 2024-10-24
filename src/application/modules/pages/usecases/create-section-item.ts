import { Item, Section } from '@/application/entities';
import { ItemSchema } from '../entities';
import PageRepository from '../repository/page-repository';

interface CreateSectionItemUsecaseRequest {
  section: Section;
  data: ItemSchema;
}

// criar item
// relacionar item com secção
// retornar array de items atualizado da secção

export default class CreateSectionItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute({
    data,
    section
  }: CreateSectionItemUsecaseRequest): Promise<Item[]> {
    const createdItem = await this.repository.createItem(data);

    const sectionItems = section.items || [];
    sectionItems.push(createdItem);

    const updatedSection = await this.repository.updateSection({
      id: section.id,
      data: {
        items: sectionItems.map((item) => item.id)
      }
    });

    return updatedSection.items || sectionItems;
  }
}
