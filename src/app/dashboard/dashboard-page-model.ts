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
import BackendPagesRepository from '@/infra/http/backend/pages/repository/backend-pages-repository';
import usePagesStore from '@/store/pages';
import useUserStore from '@/store/uset';
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

  const {
    pages,
    setSelectedPage,
    pageSelected,
    setPages,
    refreshSelectedPage
  } = usePagesStore();

  const { jwtToken } = useUserStore();
  const pageRepository = new BackendPagesRepository(axiosInstance, jwtToken);

  const { updatePage, deletePage, publishPage, unPublishPage } = usePageModel({
    pageRepository
  });

  const {
    createSection,
    updateSection,
    deleteSection,
    publishSection,
    unpublishSection
  } = useSectionModel({ pageRepository });

  const { createItem, updateItem, deleteItem, publishItem, unPublishItem } =
    useItemModel({
      pageRepository
    });

  const { uploadMedia } = useMediaModel({ pageRepository });

  useEffect(() => {
    if (!pageSelected && pages) {
      setSelectedPage(pages[0]);
    }
  }, [pages]);

  function liveUpdateSection(section: Section, index: number) {
    if (pageSelected) {
      const sections = pageSelected.sectionsPages || [];
      sections[index] = section;
      setSelectedPage({
        ...pageSelected,
        sectionsPages: sections
      });
    }
  }

  function liveUpdateItem(currentItem: Item, index: number) {
    if (pageSelected) {
      const items = pageSelected.items || [];
      items[index] = currentItem;
      setSelectedPage({
        ...pageSelected,
        items
      });
    }
  }

  async function updateCurrentPage(data: PageSchema) {
    if (pageSelected) {
      await updatePage(data, pageSelected.id)
        .then(async (page) => {
          await refreshSelectedPage();
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
          setSelectedPage(pages[0]);
        } else {
          setSelectedPage(undefined);
        }
      });
    }
  }

  function getPageUrl(page: Page) {
    return `${BASEURL}/${page.slug}`;
  }

  async function handlerPublishPage(page: Page) {
    await publishPage(page.id)
      .then((publishedAt) => {
        setSelectedPage({
          ...pageSelected!,
          publishedAt
        });
        toast(`A página "${page.name}" foi pulicada com sucesso !`, {
          description: `Ela está disponível em: ${getPageUrl(page)}`
        });
      })
      .catch(() => {
        toast('Ops', {
          description: `Tivemos um problema em publicar a página: ${page.name}`
        });
      });
  }

  async function handlerUnPublishPage(page: Page) {
    await unPublishPage(page.id)
      .then((publishedAt) => {
        setSelectedPage({
          ...pageSelected!,
          publishedAt
        });
        toast(`A página "${page.name}" foi despulicada com sucesso !`, {
          description: 'Sua página não está mais disponível'
        });
      })
      .catch(() => {
        toast('Ops', {
          description: `Tivemos um problema em despulicar a página: ${page.name}`
        });
      });
  }

  async function handlerCreateSection(section: SectionSchema) {
    await createSection({
      ...section,
      pageId: pageSelected?.id
    })
      .then(async (section) => {
        if (!pageSelected) return;
        await refreshSelectedPage();
        toast('Ôba, você criou uma nova secção');
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
    if (!pageSelected?.sectionsPages?.length) return;
    await deleteSection(sectionId)
      .then(async () => {
        await refreshSelectedPage();
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
      .then(async () => {
        await refreshSelectedPage();
        toast(`A secção ${section.title} foi publicado !`);
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
      .then(async () => {
        await refreshSelectedPage();
        toast(`A secção ${section.title} foi despublicada !`);
      })
      .catch((e) => {
        console.error(e.message);
        toast('Ops, tivemos um problema', {
          description: `Não foi possível despublicar o item ${section.title}`
        });
      });
  }

  async function handlerUpdateItem(item: ItemSchema, id: string) {
    await updateItem(item, id)
      .then(async () => {
        await refreshSelectedPage();
        toast(`O Item foi atualizada`);
      })
      .catch(() => {
        toast('Ops, tivemos um problema', {
          description: 'Tente em alguns estantes'
        });
      });
  }

  async function handlerCreateItem(item: ItemSchema, sectionId?: string) {
    await createItem({
      ...item,
      sectionId,
      pageId: sectionId ? undefined : pageSelected?.id
    })
      .then(async () => {
        await refreshSelectedPage();
        toast(`O Item "${item.title}" criado com sucesso!`);
      })
      .catch((e) => {
        console.error(e);
        toast('Ops, tivemos um problema', {
          description: 'Tente em alguns estantes'
        });
      });
  }

  async function handlerDeleteItem(id: string, sectionId?: string) {
    await deleteItem(id)
      .then(async () => {
        await refreshSelectedPage();
        toast(`O item foi excluído!"`);
      })
      .catch(() => {
        toast('Ops, tivemos um problema', {
          description: 'Não foi possível excluir seu item.'
        });
      });
  }

  async function handlerPublishItem(item: Item, sectionId?: string) {
    await publishItem(item.id)
      .then(async () => {
        await refreshSelectedPage();
        toast(`O item ${item.title} foi publicado !`);
      })
      .catch(() => {
        toast('Ops, tivemos um problema', {
          description: `Não foi possível publicar o item ${item.title}`
        });
      });
  }

  async function handlerUnpublishItem(item: Item, sectionId?: string) {
    await unPublishItem(item.id)
      .then(async () => {
        await refreshSelectedPage();
        toast(`O item ${item.title} foi despublicado !`);
      })
      .catch(() => {
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
    if (!pageSelected) return;
    const url = `${BASEURL}/${pageSelected.slug}`;
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
        qrCode.download({ extension: 'png', name: pageSelected.name });
        break;
      default:
        await navigator.clipboard.writeText(url).then(() => {
          toast(`O link da página foi copiado para sua área de transferência`, {
            description: `Seu link: ${url}`
          });
        });
    }
  }

  return {
    uploadMedia,
    updateCurrentPage,
    handlerDeletePage,
    handlerPublishPage,
    handlerUnPublishPage,
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
    navigationMenuPage,
    setCurrentTab,
    currentTab,
    setConfirmActionData,
    confirmActionData,
    cardDialogOpen,
    setCardDialogOpen,
    qrCode,
    BASEURL
  };
}
