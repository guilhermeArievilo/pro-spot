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
import DeleteItemUsecase from '@/application/modules/pages/usecases/delete-item-usecase';
import CreateSectionItemUsecase from '@/application/modules/pages/usecases/create-section-item';
import ConfirmAction from '@/components/dashboard/confirm-action';
import CreateSectionEntry from '@/components/dashboard/create-section-entry';
import UploadMediaUsecase from '@/application/modules/pages/usecases/upload-media-usecase';
import PublishItemUsecase from '@/application/modules/pages/usecases/publish-item-usecase';
import UnpublishItemUsecase from '@/application/modules/pages/usecases/unpublish-item-usecase';
import PublishSectionUsecase from '@/application/modules/pages/usecases/publish-section-usecase';
import UnpublishSectionUsecase from '@/application/modules/pages/usecases/unpublish-section-usecase';
import CreateSectionUsecase from '@/application/modules/pages/usecases/create-section-usecase';
import DeleteSectionUsecase from '@/application/modules/pages/usecases/delete-section-usecase';

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

type ConfirmActionDataProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirmRef: string;
  recordId: string;
  sectionId?: string;
};

export default function ShowPage() {
  const [confirmActionData, setConfirmActionData] =
    useState<ConfirmActionDataProps>({
      title: 'Excluir item',
      description: 'Tem certeza que deseja excluir este item ?',
      open: false,
      onConfirmRef: 'item',
      recordId: ''
    });
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

  async function uploadMedia(media: File) {
    const uploadMediaCase = new UploadMediaUsecase(pagesRepository);

    return await uploadMediaCase.execute(media);
  }

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
      await updatePage
        .execute({
          id: currentPage.id,
          data
        })
        .then((page) => {
          toast('Ôba, sua página foi atualizada');
        })
        .catch((e) => {
          console.error(e);
          toast('Ops, tivemos um problema', {
            description: 'Tente em alguns estantes'
          });
        });
    }
  }

  async function createSection(section: SectionSchema) {
    const createSectionCase = new CreateSectionUsecase(pagesRepository);
    const updatePageCase = new UpdatePageUsecase(pagesRepository);

    await createSectionCase
      .execute(section)
      .then(async (section) => {
        const sections = currentPage?.sectionsPages || [];
        sections.push(section);

        if (currentPage) {
          await updatePageCase
            .execute({
              id: currentPage.id,
              data: {
                sections: sections.map((currentSection) => currentSection.id)
              }
            })
            .then(() => {
              setCurrentPage((prev) => {
                return prev
                  ? {
                      ...prev,
                      sectionsPages: sections
                    }
                  : prev;
              });

              toast('Ôba, você criou uma nova secção');
            })
            .catch((e) => {
              console.error(e);
              toast('Ops, tivemos um problema', {
                description:
                  'Por algum motivo não conseguimos atualizar sua página'
              });
            });
        }
      })
      .catch((e) => {
        console.error(e);
        toast('Ops, tivemos um problema', {
          description: 'Não conseguimos cria sua secção.'
        });
      });
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

  async function deleteSection(sectionId: string) {
    if (!currentPage?.sectionsPages?.length) return;
    const { sectionsPages: sections } = currentPage;

    const sectionIndex = sections.findIndex(
      (currentSection) => currentSection.id === sectionId
    );

    const deleteSectionCase = new DeleteSectionUsecase(pagesRepository);

    await deleteSectionCase
      .execute(sectionId)
      .then(() => {
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                sectionsPages:
                  sectionIndex > -1 && sectionIndex === 0
                    ? undefined
                    : prev.sectionsPages?.filter(
                        (currentSection) => currentSection.id !== sectionId
                      )
              }
            : prev;
        });
        toast('Pronto, sua secção foi excluida.');
      })
      .catch((e) => {
        console.error(e);
        toast('Ops, tivemos um problema', {
          description: 'Não conseguimos excluir sua secção.'
        });
      });
  }

  async function handlerPublishSection(section: Section) {
    const publishSectionCase = new PublishSectionUsecase(pagesRepository);

    await publishSectionCase
      .execute(section.id)
      .then((res) => {
        toast(`A secção ${section.title} foi publicado !`);
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                sectionsPages: prev?.sectionsPages?.map((mapSection) => {
                  if (section.id === mapSection.id) {
                    return {
                      ...mapSection,
                      publishedAt: res.publishedAt
                    };
                  }
                  return mapSection;
                })
              }
            : prev;
        });
      })
      .catch((e) => {
        console.error(e.message);
        toast('Ops, tivemos um problema', {
          description: `Não foi possível publicar a secção ${section.title}`
        });
      });
  }

  async function handlerUnpublishSection(section: Section) {
    const unpublishSectionCase = new UnpublishSectionUsecase(pagesRepository);

    await unpublishSectionCase
      .execute(section.id)
      .then((res) => {
        toast(`A secção ${section.title} foi despublicada !`);
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                sectionsPages: prev?.sectionsPages?.map((mapSection) => {
                  if (section.id === mapSection.id) {
                    return {
                      ...mapSection,
                      publishedAt: res.publishedAt
                    };
                  }
                  return mapSection;
                })
              }
            : prev;
        });
      })
      .catch((e) => {
        console.error(e.message);
        toast('Ops, tivemos um problema', {
          description: `Não foi possível despublicar o item ${section.title}`
        });
      });
  }

  async function updateItem(item: ItemSchema, id: string) {
    const updateItemCase = new UpdateItemUsecase(pagesRepository);

    const result = await updateItemCase.execute({
      id,
      data: item
    });

    if (result.status === 'success') {
      toast(`O Item foi atualizada`);
      return;
    }

    toast('Ops, tivemos um problema', {
      description: 'Tente em alguns estantes'
    });
  }

  async function createItem(item: ItemSchema, sectionId?: string) {
    if (sectionId && currentPage?.sectionsPages?.length) {
      const contextSectionIndex = currentPage.sectionsPages.findIndex(
        (currentSection) => currentSection.id === sectionId
      );

      if (contextSectionIndex > -1) {
        const currentSection = currentPage.sectionsPages[contextSectionIndex];

        // Começa o processo de criação e relacionamento das entidades.
        const createSectionItemCase = new CreateSectionItemUsecase(
          pagesRepository
        );

        return await createSectionItemCase
          .execute({
            data: item,
            section: currentSection
          })
          .then((sectionItems) => {
            setCurrentPage({
              ...currentPage,
              sectionsPages: currentPage?.sectionsPages?.map((section) => {
                if (section.id === sectionId) {
                  return {
                    ...section,
                    items: sectionItems
                  };
                }
                return section;
              })
            });
            toast(`O Item "${item.title}" criado com sucesso!`);
          })
          .catch((e) => {
            console.error(e);
            toast('Ops, tivemos um problema', {
              description: 'Tente em alguns estantes'
            });
          });
      }

      toast('Ops, tivemos um problema', {
        description: 'Algo deu errado com a secção em questão.'
      });
      return;
    }

    // Se for um item avulso
    const createItemCase = new CreateItemUsecase(pagesRepository);
    await createItemCase
      .execute(item)
      .then(async (createdItem) => {
        const itemsPage: Item[] = currentPage?.items?.length
          ? currentPage.items
          : [];

        itemsPage.push(createdItem);

        const updatePageCase = new UpdatePageUsecase(pagesRepository);

        await updatePageCase
          .execute({
            id: currentPage?.id!,
            data: {
              items: itemsPage.map((item) => item.id)
            }
          })
          .then(() => {
            setCurrentPage({
              ...currentPage,
              items: itemsPage
            } as Page);
            toast(`O Item "${item.title}" criado com sucesso!`);
          });
      })
      .catch((e) => {
        console.error(e);

        toast('Ops, tivemos um problema', {
          description:
            'Algo deu errado ao criar o item, tente em alguns estantes.'
        });
      });
  }

  async function deleteItem(id: string, sectionId?: string) {
    const deleteItemCase = new DeleteItemUsecase(pagesRepository);

    if (currentPage?.sectionsPages?.length && sectionId) {
      const contextSectionIndex = currentPage.sectionsPages.findIndex(
        (currentSection) => currentSection.id === sectionId
      );

      if (contextSectionIndex > -1) {
        let contextItems =
          currentPage.sectionsPages[contextSectionIndex].items || [];

        const itemIndex = contextItems?.findIndex(
          (currentItem) => currentItem.id === id
        );

        if (itemIndex > -1 && contextItems?.length > 1) {
          contextItems.splice(itemIndex, 1);
        } else {
          contextItems = [];
        }

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

        const sectionToUpdate = currentPage.sectionsPages[contextSectionIndex];

        await updateSection(
          {
            title: sectionToUpdate.title,
            alignContent: sectionToUpdate.alignContent,
            items: contextItems?.map((item) => item.id) || undefined
          },
          sectionId
        );

        const result = await deleteItemCase.execute(id);
        if (result.status === 'error') {
          toast('Ops, tivemos um problema', {
            description: 'Não foi possível excluir seu item.'
          });
          return;
        }
        toast(`O item foi excluído!"`);
        return;
      }

      toast('Ops, tivemos um problema', {
        description: 'Parece que a secção em questão não existe mais.'
      });
      return;
    }

    if (currentPage?.items?.length) {
      let currentItems = currentPage.items;

      const itemIndex = currentItems?.findIndex(
        (currentItem) => currentItem.id === id
      );

      if (itemIndex > -1 && currentItems?.length > 1) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems = undefined!;
      }

      const updatePageCase = new UpdatePageUsecase(pagesRepository);
      await updatePageCase
        .execute({
          id: currentPage.id,
          data: {
            items: currentItems?.map((item) => item.id) || undefined
          }
        })
        .then(async () => {
          await deleteItemCase.execute(id);
          setCurrentPage({
            ...currentPage,
            items: currentItems
          });
        })
        .catch(() => {
          toast('Ops, tivemos um problema', {
            description: 'Não foi possível excluir seu item.'
          });
        });

      toast(`O item foi excluído!`);
    }
  }

  async function handlerPublishItem(item: Item, sectionId?: string) {
    const publishItemCase = new PublishItemUsecase(pagesRepository);

    await publishItemCase
      .execute(item.id)
      .then((res) => {
        toast(`O item ${item.title} foi publicado !`);
        if (sectionId) {
          setCurrentPage((prev) => {
            return prev
              ? {
                  ...prev,
                  sectionsPages: prev.sectionsPages?.map((currentSection) => {
                    if (currentSection.id === sectionId) {
                      return {
                        ...currentSection,
                        items: currentSection.items?.map(
                          (currentSectionItem) => {
                            if (currentSectionItem.id === item.id) {
                              return {
                                ...currentSectionItem,
                                publishedAt: res.publishedAt
                              };
                            }
                            return currentSectionItem;
                          }
                        )
                      };
                    }
                    return currentSection;
                  })
                }
              : prev;
          });
          return;
        }
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                items: prev?.items?.map((mapItem) => {
                  if (item.id === mapItem.id) {
                    return {
                      ...mapItem,
                      publishedAt: res.publishedAt
                    };
                  }
                  return mapItem;
                })
              }
            : prev;
        });
      })
      .catch((e) => {
        console.error(e.message);
        toast('Ops, tivemos um problema', {
          description: `Não foi possível publicar o item ${item.title}`
        });
      });
  }

  async function handlerUnpublishItem(item: Item, sectionId?: string) {
    const unpublishItemCase = new UnpublishItemUsecase(pagesRepository);

    await unpublishItemCase
      .execute(item.id)
      .then((res) => {
        toast(`O item ${item.title} foi despublicado !`);
        if (sectionId) {
          setCurrentPage((prev) => {
            return prev
              ? {
                  ...prev,
                  sectionsPages: prev.sectionsPages?.map((currentSection) => {
                    if (currentSection.id === sectionId) {
                      return {
                        ...currentSection,
                        items: currentSection.items?.map(
                          (currentSectionItem) => {
                            if (currentSectionItem.id === item.id) {
                              return {
                                ...currentSectionItem,
                                publishedAt: res.publishedAt
                              };
                            }
                            return currentSectionItem;
                          }
                        )
                      };
                    }
                    return currentSection;
                  })
                }
              : prev;
          });
          return;
        }
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                items: prev?.items?.map((mapItem) => {
                  if (item.id === mapItem.id) {
                    return {
                      ...mapItem,
                      publishedAt: res.publishedAt
                    };
                  }
                  return mapItem;
                })
              }
            : prev;
        });
      })
      .catch((e) => {
        console.error(e.message);
        toast('Ops, tivemos um problema', {
          description: `Não foi possível despublicar o item ${item.title}`
        });
      });
  }

  async function onDeleteConfirmation() {
    if (
      confirmActionData.onConfirmRef === 'item' &&
      confirmActionData.recordId
    ) {
      await deleteItem(confirmActionData.recordId, confirmActionData.sectionId);
    }

    if (
      confirmActionData.onConfirmRef === 'section' &&
      confirmActionData.recordId
    ) {
      await deleteSection(confirmActionData.recordId);
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
          <div className="h-full aspect-[9/16] overflow-hidden">
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
                <div className="w-full flex flex-col gap-6">
                  {currentPage.sectionsPages?.map((section, index) => (
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
                      onDeleteItem={(id, title) => {
                        setConfirmActionData({
                          open: true,
                          description:
                            'Tem certeza que deseja excluir este item ?',
                          title: `Você está excluindo o item ${title}`,
                          onConfirmRef: 'item',
                          recordId: id,
                          sectionId: section.id
                        });
                      }}
                      onUploadMedia={uploadMedia}
                      togglePublishItem={(item) => {
                        item.publishedAt
                          ? handlerUnpublishItem(item, section.id)
                          : handlerPublishItem(item, section.id);
                      }}
                      togglePublish={(currentSection) => {
                        currentSection.publishedAt
                          ? handlerUnpublishSection(currentSection)
                          : handlerPublishSection(currentSection);
                      }}
                      onDelete={(id) => {
                        setConfirmActionData({
                          open: true,
                          description:
                            'Tem certeza que deseja excluir esta secção ?',
                          title: `Você está excluindo a secção "${section.title}"`,
                          onConfirmRef: 'section',
                          recordId: id
                        });
                      }}
                    />
                  ))}
                </div>
                {!!currentPage.sectionsPages?.length && (
                  <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
                )}
                <CreateSectionEntry onCreateASection={createSection} />
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
                      onDelete={(id) => {
                        setConfirmActionData({
                          open: true,
                          description:
                            'Tem certeza que deseja excluir este item ?',
                          title: `Você está excluindo o item ${item.title}`,
                          onConfirmRef: 'item',
                          recordId: id
                        });
                      }}
                      onUploadMedia={uploadMedia}
                      togglePublish={(currentItem) => {
                        currentItem.publishedAt
                          ? handlerUnpublishItem(currentItem)
                          : handlerPublishItem(currentItem);
                      }}
                    />
                  ))}
                </div>
                {!!currentPage.items?.length && (
                  <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
                )}
                <CreateItemRotine
                  onCreateAItem={(item) => createItem(item)}
                  onUploadMedia={uploadMedia}
                />
              </div>
            </div>
          )}
          {currentTab === 'geral' && (
            <GeralInfoData
              key={currentPage.id}
              page={currentPage}
              onUpdatePage={setCurrentPage}
              onSubmitGeralInfo={updateCurrentPage}
              onUploadMedia={uploadMedia}
            />
          )}
        </div>
      )}
      <ConfirmAction
        title={confirmActionData.title}
        description={confirmActionData.description}
        open={confirmActionData.open}
        onChangeOpen={(open) => {
          setConfirmActionData({
            ...confirmActionData,
            open
          });
        }}
        onConfirm={onDeleteConfirmation}
      />
    </main>
  );
}
