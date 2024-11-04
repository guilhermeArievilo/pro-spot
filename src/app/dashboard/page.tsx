'use client';
import GeralInfoData from '@/components/dashboard/geral-info-data';
import ItemBlock from '@/components/dashboard/item-block';
import Preview from '@/components/dashboard/preview';
import SectionBlock from '@/components/dashboard/section-block';
import TopBodyMenu from '@/components/dashboard/top-body-menu';
import CreateItemRotine from '@/components/dashboard/choose-type-item';
import ConfirmAction from '@/components/dashboard/confirm-action';
import CreateSectionEntry from '@/components/dashboard/create-section-entry';
import CardDialog from '@/components/dashboard/CardDialog';
import useDashboardPageModel from './dashboard-page-model';

export default function ShowPage() {
  const {
    currentPage,
    sharePage,
    navigationMenuPage,
    setCurrentTab,
    currentTab,
    liveUpdateSection,
    handlerUpdateSection,
    handlerUpdateItem,
    handlerCreateItem,
    setConfirmActionData,
    handlerUnpublishItem,
    handlerPublishItem,
    handlerUnpublishSection,
    handlerPublishSection,
    handlerCreateSection,
    liveUpdateItem,
    uploadMedia,
    setCurrentPage,
    updateCurrentPage,
    handlerDeletePage,
    confirmActionData,
    onDeleteConfirmation,
    cardDialogOpen,
    setCardDialogOpen,
    qrCode,
    BASEURL
  } = useDashboardPageModel();
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
            onSharedPress={sharePage}
            options={navigationMenuPage}
            defaultOption={navigationMenuPage[0].value}
            onOptionChange={(opionValue) => {
              setCurrentTab(opionValue);
            }}
            views={currentPage.views}
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
                        handlerUpdateSection(currentSection, section.id);
                      }}
                      onItemSave={(item, id) => handlerUpdateItem(item, id)}
                      onCreateItem={(entry) =>
                        handlerCreateItem(entry, section.id)
                      }
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
                <CreateSectionEntry onCreateASection={handlerCreateSection} />
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-2xl w-full">Itens Avulsos</span>
                <div className="w-full flex flex-col gap-6">
                  {currentPage?.items?.map((item, index) => (
                    <ItemBlock
                      key={item.id}
                      item={item}
                      onSave={(currentItem) =>
                        handlerUpdateItem(currentItem, item.id)
                      }
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
                  onCreateAItem={(item) => handlerCreateItem(item)}
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
              onDelete={handlerDeletePage}
              togglePublish={() => {}}
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
      {currentPage && (
        <CardDialog
          page={currentPage}
          key={currentPage.id}
          open={cardDialogOpen}
          onChangeOpen={(isOpen) => setCardDialogOpen(isOpen)}
          qrCode={qrCode}
          baseUrl={BASEURL || ''}
        />
      )}
    </main>
  );
}
