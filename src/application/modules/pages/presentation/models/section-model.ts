import { Section } from '@/application/entities';
import { SectionSchema } from '../../entities';
import PageRepository from '../../repository/page-repository';
import CreateSectionUsecase from '../../usecases/create-section-usecase';
import DeleteSectionUsecase from '../../usecases/delete-section-usecase';
import UpdateSectionUsecase from '../../usecases/update-section-usecase';
import PublishSectionUsecase from '../../usecases/publish-section-usecase';
import UnpublishSectionUsecase from '../../usecases/unpublish-section-usecase';

interface useSectionModelProps {
  pageRepository: PageRepository;
}

export default function useSectionModel({
  pageRepository
}: useSectionModelProps) {
  async function createSection(section: SectionSchema) {
    const createSectionCase = new CreateSectionUsecase(pageRepository);

    const sectionCreated = await createSectionCase.execute(section);

    return sectionCreated;
  }

  async function updateSection(section: SectionSchema, id: string) {
    const updateSectionCase = new UpdateSectionUsecase(pageRepository);

    const updatedSection = await updateSectionCase.execute({
      id,
      data: section
    });

    return updatedSection;
  }

  async function deleteSection(sectionId: string) {
    const deleteSectionCase = new DeleteSectionUsecase(pageRepository);

    await deleteSectionCase.execute(sectionId);
  }

  async function publishSection(sectionId: string) {
    const publishSectionCase = new PublishSectionUsecase(pageRepository);

    const { publishedAt } = await publishSectionCase.execute(sectionId);

    return publishedAt;
  }

  async function unpublishSection(sectionId: string) {
    const unpublishSectionCase = new UnpublishSectionUsecase(pageRepository);

    await unpublishSectionCase.execute(sectionId);

    return null;
  }

  return {
    createSection,
    updateSection,
    deleteSection,
    publishSection,
    unpublishSection
  };
}
