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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import usePagesStore from '@/store/pages';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ShowPage() {
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
    <main className="max-h-full w-full grid grid-cols-12 gap-6 p-4">
      <div className="col-span-3 h-full overflow-hidden">
        {currentPage && <Preview page={currentPage} />}
      </div>
      <div className="col-span-9 h-full overflow-hidden">
        <Tabs
          defaultValue="content"
          className="h-full w-full flex-1 flex flex-col gap-4 items-center"
        >
          <TabsList>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="geral-info">
              Informações Gerais da Página
            </TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="w-full overflow-y-auto">
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
          </TabsContent>
          <TabsContent value="geral-info" className="w-full">
            {currentPage && (
              <GeralInfoData
                page={currentPage}
                onUpdatePage={setCurrentPage}
                onSubmitGeralInfo={updateCurrentPage}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
