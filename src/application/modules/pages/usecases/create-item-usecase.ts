import { Item } from '@/application/entities';
import { ItemSchema } from '../entities';
import PageRepository from '../repository/page-repository';

export default class CreateItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute(item: ItemSchema): Promise<Item | null> {
    try {
      const createdItem = await this.repository.createItem(item);
      return createdItem;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
