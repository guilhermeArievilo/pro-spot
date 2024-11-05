import PageRepository from '../../repository/page-repository';
import GetPagesByUserId from '../../usecases/get-pages-by-user-id';
import { PageSchema } from '../../entities';
import CreatePageUsecase from '../../usecases/create-page-usecase';
import GetPageByIdUsecase from '../../usecases/get-page-by-id-usecase';
import UpdatePageUsecase from '../../usecases/update-page-usecase';
import GetPageUsecase from '../../usecases/get-page-usecase';
import AddViewToPageUsecase from '../../usecases/add-view-to-page-usecase';
import DeletePageUsecase from '../../usecases/delete-page-usecase';
import PublishPageUsecase from '../../usecases/publish-page-usecase';

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

  async function getPageBySlug(slug: string) {
    const getPageUsecase = new GetPageUsecase(pageRepository);
    const page = await getPageUsecase.execute(slug);

    return page;
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

  async function deletePage(pageId: string) {
    const updatePage = new DeletePageUsecase(pageRepository);
    await updatePage.execute(pageId);
  }

  async function publishPage(pageId: string) {
    const publishPageCase = new PublishPageUsecase(pageRepository);

    const { publishedAt } = await publishPageCase.execute(pageId);

    return publishedAt;
  }

  async function unPublishPage(pageId: string) {
    const publishPageCase = new PublishPageUsecase(pageRepository);

    await publishPageCase.execute(pageId);

    return null;
  }

  async function addViewToPage(slug: string) {
    const addViewToPageCase = new AddViewToPageUsecase(pageRepository);
    await addViewToPageCase.execute(slug);
  }

  // implementar o delete page

  return {
    getPageBySlug,
    fetchPageById,
    fetchPagesByUserId,
    createPage,
    updatePage,
    deletePage,
    addViewToPage,
    publishPage,
    unPublishPage
  };
}
