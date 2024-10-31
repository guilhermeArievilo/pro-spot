import { Item } from '@/application/entities';
import { ItemSchema } from '../entities';
import PageRepository from '../repository/page-repository';

export default class UpdateItemUsecase {
  constructor(private repository: PageRepository) {}

  async execute({ id, data }: { id: string; data: ItemSchema }): Promise<Item> {
    const item = await this.repository.updateItem({
      id,
      data
    });

    return item;
  }
}
