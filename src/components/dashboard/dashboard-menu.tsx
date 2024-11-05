import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { Page } from '@/application/entities';
import PageMenu from './page-menu';
import Link from 'next/link';

interface DashboardMenuProps {
  onPressToCreatePage: () => void;
  onPageClick: (page: Page) => void;
  pages: Page[];
  pageSelected: Page | undefined;
}

export default function DashboardMenu({
  onPressToCreatePage,
  pages,
  pageSelected,
  onPageClick
}: DashboardMenuProps) {
  return (
    <menu className="p-2 bg-light-surface/60 dark:bg-dark-surface/60 backdrop-blur-md flex items-center justify-center gap-4 rounded-full">
      {!pages?.length ? (
        <span className="px-4 text-xs opacity-30">
          Sem páginas até o momento
        </span>
      ) : (
        <>
          {pages.map((page) => (
            <Link
              href={'/dashboard'}
              key={page.id}
              onClick={() => onPageClick(page)}
            >
              <PageMenu
                name={page.name}
                photoProfile={page.photoProfile}
                isSelected={pageSelected ? pageSelected.id === page.id : false}
              />
            </Link>
          ))}
        </>
      )}
      <span className="w-[1px] h-[40px] dark:bg-dark-outlineVariant bg-light-outlineVariant"></span>
      <Button
        className="rounded-full gap-3 w-auto text-xs"
        variant={'ghost'}
        onClick={onPressToCreatePage}
      >
        <PlusIcon />
        Adicionar página
      </Button>
    </menu>
  );
}
