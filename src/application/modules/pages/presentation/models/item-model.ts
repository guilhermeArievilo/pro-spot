import { Item, Section } from '@/application/entities';
import { ItemSchema } from '../../entities';
import PageRepository from '../../repository/page-repository';
import CreateItemUsecase from '../../usecases/create-item-usecase';
import CreateSectionItemUsecase from '../../usecases/create-section-item';
import UpdateItemUsecase from '../../usecases/update-item-usecase';
import DeleteItemUsecase from '../../usecases/delete-item-usecase';
import PublishItemUsecase from '../../usecases/publish-item-usecase';

interface useItemModelProps {
  pageRepository: PageRepository;
}

export default function useItemModel({ pageRepository }: useItemModelProps) {
  async function createItem(item: ItemSchema) {
    const createItemCase = new CreateItemUsecase(pageRepository);

    const createdItem = createItemCase.execute(item);

    return createdItem;
  }

  async function createSectionItem(item: ItemSchema, section: Section) {
    const createItemCase = new CreateSectionItemUsecase(pageRepository);

    const sectionItems = createItemCase.execute({
      data: item,
      section
    });

    return sectionItems;
  }

  async function updateItem(item: ItemSchema, id: string) {
    const updateItemCase = new UpdateItemUsecase(pageRepository);

    const result = await updateItemCase.execute({
      id,
      data: item
    });

    return result;
  }

  async function deleteItem(id: string) {
    const deleteItemCase = new DeleteItemUsecase(pageRepository);

    await deleteItemCase.execute(id);
  }

  async function publishItem(itemId: string) {
    const publishItemCase = new PublishItemUsecase(pageRepository);

    const { publishedAt } = await publishItemCase.execute(itemId);

    return publishedAt;
  }

  async function unPublishItem(itemId: string) {
    const publishItemCase = new PublishItemUsecase(pageRepository);

    await publishItemCase.execute(itemId);

    return null;
  }

  return {
    createItem,
    createSectionItem,
    updateItem,
    deleteItem,
    publishItem,
    unPublishItem
  };
}
