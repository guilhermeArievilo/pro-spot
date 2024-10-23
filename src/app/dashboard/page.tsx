'use client';

import { Item, Page, Section } from '@/application/entities';
import {
  ItemSchema,
  PageSchema,
  SectionSchema
} from '@/application/modules/pages/entities';
import GetPageByIdUsecase from '@/application/modules/pages/usecases/get-page-by-id-usecase';
import UpdatePageUsecase from '@/application/modules/pages/usecases/update-page-usecase';
import GeralInfoData from '@/components/dashboard/geral-info-data';
import ItemBlock from '@/components/dashboard/item-block';
import Preview from '@/components/dashboard/preview';
import SectionBlock from '@/components/dashboard/section-block';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import usePagesStore from '@/store/pages';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TopBodyMenu from '@/components/dashboard/top-body-menu';
import UpdateSectionUsecase from '@/application/modules/pages/usecases/update-section-usecase';
import UpdateItemUsecase from '@/application/modules/pages/usecases/update-item-usecase';
import CreateItemRotine from '@/components/dashboard/choose-type-item';
import CreateItemUsecase from '@/application/modules/pages/usecases/create-item-usecase';

const navigationMenuPage = [
  {
    label: 'Conteúdo',
    value: 'content'
  },
  {
    label: 'Informações Gerais da Página',
    value: 'geral'
  }
];

export default function ShowPage() {
  const [currentTab, setCurrentTab] = useState<string>(
    navigationMenuPage[0].value
  );
  const [currentPage, setCurrentPage] = useState<Page>();
  const { pages, setSelectedPage, pageSelected } = usePagesStore();
  const pagesRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  useEffect(() => {
    if (!pageSelected && pages) {
      setSelectedPage(pages[0]);
    }
  }, [pages]);

  function liveUpdateSection(section: Section, index: number) {
    if (currentPage) {
      const sections = currentPage.sectionsPages || [];
      sections[index] = section;
      setCurrentPage({
        ...currentPage,
        sectionsPages: sections
      });
    }
  }

  function liveUpdateItem(currentItem: Item, index: number) {
    if (currentPage) {
      const items = currentPage.items || [];
      items[index] = currentItem;
      setCurrentPage({
        ...currentPage,
        items
      });
    }
  }

  async function fetchPageById(id: string) {
    const getPageById = new GetPageByIdUsecase(pagesRepository);
    const page = await getPageById.execute(id);
    if (page) {
      setCurrentPage(page);
    }
  }

  async function updateCurrentPage(data: PageSchema) {
    const updatePage = new UpdatePageUsecase(pagesRepository);
    if (currentPage) {
      const result = await updatePage.execute({
        id: currentPage.id,
        data
      });

      if (result.status === 'success') {
        await fetchPageById(currentPage.id);
        toast('Ôba, sua página foi atualizada');
        return;
      }

      toast('Ops, tivemos um problema', {
        description: 'Tente em alguns estantes'
      });
    }
  }

  async function updateSection(section: SectionSchema, id: string) {
    const updateSectionCase = new UpdateSectionUsecase(pagesRepository);

    const result = await updateSectionCase.execute({
      id,
      data: section
    });

    if (result.status === 'success') {
      toast(`A Secção "${section.title}" foi atualizada`);
      return;
    }

    toast('Ops, tivemos um problema', {
      description: 'Tente em alguns estantes'
    });
  }

  async function updateItem(item: ItemSchema, id: string) {
    const updateItemCase = new UpdateItemUsecase(pagesRepository);

    const result = await updateItemCase.execute({
      id,
      data: item
    });

    if (result.status === 'success') {
      toast(`O Item "${item.title}" foi atualizada`);
      return;
    }

    toast('Ops, tivemos um problema', {
      description: 'Tente em alguns estantes'
    });
  }

  async function createItem(item: ItemSchema, sectionId?: string) {
    const createItemCase = new CreateItemUsecase(pagesRepository);

    const createdItem = await createItemCase.execute(item);

    if (!createdItem) {
      toast('Ops, tivemos um problema', {
        description: 'Tente em alguns estantes'
      });
      return;
    }

    toast(`O item "${createdItem.title!} foi criado!"`);

    if (currentPage?.sectionsPages?.length && sectionId) {
      const contextSectionIndex = currentPage.sectionsPages.findIndex(
        (currentSection) => currentSection.id === sectionId
      );
      if (contextSectionIndex > -1) {
        const contextItems =
          currentPage.sectionsPages[contextSectionIndex].items;
        contextItems?.push(createdItem as Item);
        setCurrentPage({
          ...currentPage,
          sectionsPages: currentPage.sectionsPages.map((currentSection) => {
            if (currentSection.id === sectionId) {
              return {
                ...currentSection,
                items: contextItems
              };
            }
            return currentSection;
          })
        });
      }

      return;
    }

    if (currentPage?.items?.length) {
      const currentItems = currentPage.items;
      currentItems.push(createdItem as Item);

      await updateCurrentPage({
        id: currentPage.id,
        slug: currentPage.slug,
        name: currentPage.name,
        content: currentPage.content,
        items: currentItems.map((item) => item.id)
      });

      setCurrentPage({
        ...currentPage,
        items: currentItems
      });

      return;
    }

    if (currentPage) {
      await updateCurrentPage({
        id: currentPage.id,
        slug: currentPage.slug,
        name: currentPage.name,
        content: currentPage.content,
        items: [createdItem.id]
      });

      setCurrentPage({
        ...currentPage,
        items: [createdItem as Item]
      });
    }
  }

  useEffect(() => {
    if (pageSelected) {
      fetchPageById(pageSelected.id as string);
    }
  }, [pageSelected]);

  if (!currentPage) {
    <main className="flex flex-col justify-center items-center">
      <span>Não encontramos sua página</span>
    </main>;
  }

  return (
    <main className="max-h-full w-full grid grid-cols-12 gap-6 pt-4 px-4">
      {currentPage && (
        <div className="col-span-12">
          <TopBodyMenu
            pageName={currentPage.name}
            clicks={300}
            views={1000}
            onSharedPress={() => {}}
            options={navigationMenuPage}
            defaultOption={navigationMenuPage[0].value}
            onOptionChange={(opionValue) => {
              setCurrentTab(opionValue);
            }}
          />
        </div>
      )}
      {currentPage && (
        <div className="col-span-3 h-full flex items-center justify-center overflow-hidden pb-4">
          <div className="h-full aspect-[9/16]">
            <Preview page={currentPage} />
          </div>
        </div>
      )}
      {currentPage && (
        <div className="col-span-9 h-full overflow-y-auto px-6">
          {currentTab === 'content' && (
            <div className="w-full flex flex-col gap-16 pb-4">
              <div className="flex flex-col items-center gap-4">
                <span className="text-2xl w-full">Secções</span>
                <div className="w-full">
                  {currentPage?.sectionsPages?.map((section, index) => (
                    <SectionBlock
                      key={section.id}
                      section={section}
                      open={index === 0}
                      onUpdated={(section) => liveUpdateSection(section, index)}
                      onSave={(currentSection) => {
                        updateSection(currentSection, section.id);
                      }}
                      onItemSave={(item, id) => updateItem(item, id)}
                      onCreateItem={(entry) => createItem(entry, section.id)}
                    />
                  ))}
                </div>
                {!!currentPage.sectionsPages?.length && (
                  <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
                )}
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-2xl w-full">Itens Avulsos</span>
                <div className="w-full flex flex-col gap-6">
                  {currentPage?.items?.map((item, index) => (
                    <ItemBlock
                      key={item.id}
                      item={item}
                      onSave={(currentItem) => updateItem(currentItem, item.id)}
                      onUpdateItem={(item) => liveUpdateItem(item, index)}
                    />
                  ))}
                </div>
                {!!currentPage.items?.length && (
                  <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
                )}
                <CreateItemRotine onCreateAItem={(item) => createItem(item)} />
              </div>
            </div>
          )}
          {currentTab === 'geral' && (
            <GeralInfoData
              page={currentPage}
              onUpdatePage={setCurrentPage}
              onSubmitGeralInfo={updateCurrentPage}
            />
          )}
        </div>
      )}
    </main>
  );
}
