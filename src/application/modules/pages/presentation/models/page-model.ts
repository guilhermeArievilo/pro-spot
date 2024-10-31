import PageRepository from '../../repository/page-repository';
import GetPagesByUserId from '../../usecases/get-pages-by-user-id';
import { PageSchema } from '../../entities';
import CreatePageUsecase from '../../usecases/create-page-usecase';
import GetPageByIdUsecase from '../../usecases/get-page-by-id-usecase';
import UpdatePageUsecase from '../../usecases/update-page-usecase';

interface usePageModelProps {
  pageRepository: PageRepository;
}

export default function usePageModel({ pageRepository }: usePageModelProps) {
  async function fetchPageById(id: string) {
    const getPageById = new GetPageByIdUsecase(pageRepository);
    const page = await getPageById.execute(id);
    return page;
  }

  async function fetchPagesByUserId(userId: string) {
    const getPagesByUserId = new GetPagesByUserId(pageRepository);
    const pages = await getPagesByUserId.execute(userId);

    if (!pages) return;

    return pages;
  }

  async function createPage(data: PageSchema, userId: string) {
    const createPageCase = new CreatePageUsecase(pageRepository);
    const page = await createPageCase.execute(data, userId);

    return page;
  }

  async function updatePage(data: PageSchema, pageId: string) {
    const updatePage = new UpdatePageUsecase(pageRepository);
    const page = await updatePage.execute({
      id: pageId,
      data
    });

    return page;
  }

  // implementar o delete page

  return {
    fetchPageById,
    fetchPagesByUserId,
    createPage,
    updatePage
  };
}
