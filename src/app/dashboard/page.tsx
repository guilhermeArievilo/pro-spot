'use client';

import { Page } from '@/application/entities';
import { PageSchema } from '@/application/modules/pages/entities';
import DashboardScreen from '@/application/modules/pages/presentation/screens/dashboard-screen';
import GetPageByIdUsecase from '@/application/modules/pages/usecases/get-page-by-id-usecase';
import UpdatePageUsecase from '@/application/modules/pages/usecases/update-page-usecase';
import GeralInfoData from '@/components/dashboard/geral-info-data';
import ItemBlock from '@/components/dashboard/item-block';
import Preview from '@/components/dashboard/preview';
import SectionBlock from '@/components/dashboard/section-block';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import usePagesStore from '@/store/pages';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ShareIcon from '@/assets/svg/icons/share.svg';
import MoreHorizontalIcon from '@/assets/svg/icons/more-horizontal.svg';
import { Switch } from '@/components/ui/switch';
import { FormLabel } from '@/components/ui/form';
import TopBodyMenu from '@/components/dashboard/top-body-menu';

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
        toast('Ôba, sua página foi atualizada');
        return;
      }

      toast('Ops, tivemos um problema', {
        description: 'Tente em alguns estantes'
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
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex">
                  <span className="text-2xl">Secções</span>
                </div>
                {currentPage?.sectionsPages?.map((section, index) => (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    open={index === 0}
                  />
                ))}
                <div className="w-full h-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
                <div className="flex">
                  <span className="text-2xl">Itens</span>
                </div>
                {currentPage?.items?.map((item) => (
                  <ItemBlock key={item.id} item={item} />
                ))}
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
