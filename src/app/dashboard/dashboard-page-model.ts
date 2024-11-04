import { Item, Page, Section } from '@/application/entities';
import {
  ItemSchema,
  PageSchema,
  SectionSchema
} from '@/application/modules/pages/entities';
import useItemModel from '@/application/modules/pages/presentation/models/item-model';
import useMediaModel from '@/application/modules/pages/presentation/models/media-model';
import usePageModel from '@/application/modules/pages/presentation/models/page-model';
import useSectionModel from '@/application/modules/pages/presentation/models/section-model';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import usePagesStore from '@/store/pages';
import { themeColors } from '@/theme/color';
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const BASEURL = process.env.NEXT_PUBLIC_URL;

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
  critical?: boolean;
};

export default function useDashboardPageModel() {
  const [confirmActionData, setConfirmActionData] =
    useState<ConfirmActionDataProps>({
      title: 'Excluir item',
      description: 'Tem certeza que deseja excluir este item ?',
      open: false,
      onConfirmRef: 'item',
      recordId: ''
    });

  const [cardDialogOpen, setCardDialogOpen] = useState(false);

  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  const [currentTab, setCurrentTab] = useState<string>(
    navigationMenuPage[0].value
  );

  const [currentPage, setCurrentPage] = useState<Page>();
  const { pages, setSelectedPage, pageSelected, setPages } = usePagesStore();

  const pageRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  const {
    fetchPageById: fetchPageByIdModel,
    updatePage,
    deletePage
  } = usePageModel({
    pageRepository
  });

  const {
    createSection,
    updateSection,
    deleteSection,
    publishSection,
    unpublishSection
  } = useSectionModel({ pageRepository });

  const {
    createItem,
    createSectionItem,
    updateItem,
    deleteItem,
    publishItem,
    unPublishItem
  } = useItemModel({
    pageRepository
  });

  const { uploadMedia } = useMediaModel({ pageRepository });

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
    const page = await fetchPageByIdModel(id);
    if (page) {
      setCurrentPage(page);
    }
  }

  async function updateCurrentPage(data: PageSchema) {
    if (currentPage) {
      await updatePage(data, currentPage.id)
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

  async function handlerDeletePage(pageId: string) {
    const pageIndex = pages.findIndex((page) => page.id === pageId);

    if (pageIndex !== -1) {
      await deletePage(pageId).then(() => {
        const atualPages = pages;
        atualPages.splice(pageIndex, 1);
        setPages(atualPages);
        if (pageSelected?.id === pageId && pages.length) {
          setCurrentPage(pages[0]);
        } else {
          setCurrentPage(undefined);
        }
      });
    }
  }

  async function handlerCreateSection(section: SectionSchema) {
    await createSection(section)
      .then(async (section) => {
        const sections = currentPage?.sectionsPages || [];
        sections.push(section);

        if (currentPage) {
          await updatePage(
            {
              sections: sections.map((currentSection) => currentSection.id)
            },
            currentPage.id
          )
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

  async function handlerUpdateSection(section: SectionSchema, id: string) {
    await updateSection(section, id)
      .then(() => {
        toast(`A Secção "${section.title}" foi atualizada`);
      })
      .catch((e) => {
        console.error(e);
        toast('Ops, tivemos um problema', {
          description: 'Tente em alguns estantes'
        });
      });
  }

  async function handlerDeleteSection(sectionId: string) {
    if (!currentPage?.sectionsPages?.length) return;
    const { sectionsPages: sections } = currentPage;

    const sectionIndex = sections.findIndex(
      (currentSection) => currentSection.id === sectionId
    );

    await deleteSection(sectionId)
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
    await publishSection(section.id)
      .then((publishedAt) => {
        toast(`A secção ${section.title} foi publicado !`);
        setCurrentPage((prev) => {
          return prev
            ? {
                ...prev,
                sectionsPages: prev?.sectionsPages?.map((mapSection) => {
                  if (section.id === mapSection.id) {
                    return {
                      ...mapSection,
                      publishedAt
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
    await unpublishSection(section.id)
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
                      publishedAt: res
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

  async function handlerUpdateItem(item: ItemSchema, id: string) {
    const result = await updateItem(item, id);

    if (result.id === 'success') {
      toast(`O Item foi atualizada`);
      return;
    }

    toast('Ops, tivemos um problema', {
      description: 'Tente em alguns estantes'
    });
  }

  async function handlerCreateItem(item: ItemSchema, sectionId?: string) {
    if (sectionId && currentPage?.sectionsPages?.length) {
      const contextSectionIndex = currentPage.sectionsPages.findIndex(
        (currentSection) => currentSection.id === sectionId
      );

      if (contextSectionIndex > -1) {
        const currentSection = currentPage.sectionsPages[contextSectionIndex];

        // Começa o processo de criação e relacionamento das entidades.
        return await createSectionItem(item, currentSection)
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
    await createItem(item)
      .then(async (createdItem) => {
        const itemsPage: Item[] = currentPage?.items?.length
          ? currentPage.items
          : [];

        itemsPage.push(createdItem);

        await updatePage(
          {
            items: itemsPage.map((item) => item.id)
          },
          currentPage?.id!
        ).then(() => {
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

  async function handlerDeleteItem(id: string, sectionId?: string) {
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

        await deleteItem(id)
          .then(() => {
            toast(`O item foi excluído!"`);
          })
          .catch(() => {
            toast('Ops, tivemos um problema', {
              description: 'Não foi possível excluir seu item.'
            });
            return;
          });
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

      await updatePage(
        {
          items: currentItems?.map((item) => item.id) || undefined
        },
        currentPage.id
      )
        .then(async () => {
          await deleteItem(id).then(() => {
            setCurrentPage({
              ...currentPage,
              items: currentItems
            });
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
    await publishItem(item.id)
      .then((publishedAt) => {
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
                                publishedAt: publishedAt
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
                      publishedAt: publishedAt
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
    await unPublishItem(item.id)
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
                                publishedAt: res
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
                      publishedAt: res
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
      await handlerDeleteItem(
        confirmActionData.recordId,
        confirmActionData.sectionId
      );
    }

    if (
      confirmActionData.onConfirmRef === 'section' &&
      confirmActionData.recordId
    ) {
      await handlerDeleteSection(confirmActionData.recordId);
    }
  }

  async function sharePage(option: 'card' | 'QRCode' | 'copyLinkPage') {
    if (!currentPage) return;
    const url = `${BASEURL}/${currentPage.slug}`;
    switch (option) {
      case 'card':
        const qrCodeCard = new QRCodeStyling({
          width: 160,
          height: 160,
          data: url,
          dotsOptions: {
            color: themeColors.dark.onSurface,
            type: 'square'
          },
          backgroundOptions: {
            color: themeColors.dark.surfaceContainerLowest
          }
        });

        setQrCode(qrCodeCard);
        setCardDialogOpen(true);
        break;
      case 'QRCode':
        const qrCode = new QRCodeStyling({
          width: 300,
          height: 300,
          data: url,
          dotsOptions: {
            color: themeColors.dark.onSurface,
            type: 'square'
          },
          backgroundOptions: {
            color: themeColors.dark.scrim
          }
        });
        qrCode.download({ extension: 'png', name: currentPage.name });
        break;
      default:
        await navigator.clipboard.writeText(url).then(() => {
          toast(`O link da página foi copiado para sua área de transferência`, {
            description: `Seu link: ${url}`
          });
        });
    }
  }

  useEffect(() => {
    if (pageSelected) {
      fetchPageById(pageSelected.id);
    }
  }, [pageSelected]);

  return {
    uploadMedia,
    updateCurrentPage,
    handlerDeletePage,
    handlerCreateSection,
    handlerUpdateSection,
    handlerDeleteSection,
    handlerPublishSection,
    handlerUnpublishSection,
    handlerCreateItem,
    handlerUpdateItem,
    handlerDeleteItem,
    handlerPublishItem,
    handlerUnpublishItem,
    liveUpdateSection,
    liveUpdateItem,
    onDeleteConfirmation,
    sharePage,
    currentPage,
    navigationMenuPage,
    setCurrentTab,
    currentTab,
    setConfirmActionData,
    setCurrentPage,
    confirmActionData,
    cardDialogOpen,
    setCardDialogOpen,
    qrCode,
    BASEURL
  };
}
