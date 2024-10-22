import BannerSkeleton from '@/assets/svg/elements/types/banner.svg';
import CardSkeleton from '@/assets/svg/elements/types/card.svg';
import HorizontalCardSkeleton from '@/assets/svg/elements/types/h-card.svg';
import ShowcaseSkeleton from '@/assets/svg/elements/types/showcase.svg';
import ButtonSkeleton from '@/assets/svg/elements/types/button.svg';
import { Button } from '../ui/button';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

export default function ChooseTypeItem() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-fit rounded-full dark:bg-dark-surfaceContainer dark:hover:bg-dark-surfaceContainerHighest bg-light-surfaceContainer hover:bg-light-surfaceContainerHighest border dark:border-dark-outline border-light-outline transition-all ease-in-out"
          variant={'ghost'}
        >
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="my-4 p-4 gap-3 bg-dark-surfaceContainerLowest/30 backdrop-blur-lg rounded-2xl">
        <DropdownMenuLabel>
          Escolha o tipo de item que você deseja adicionar a sua página
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center">
          <DropdownMenuItem>
            <Button variant={'ghost'}>
              <div className="flex flex-col gap-4">
                <BannerSkeleton className="w-32" />
                <span>Banner</span>
              </div>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'}>
              <div className="flex flex-col gap-4">
                <CardSkeleton className="w-32" />
                <span>Card</span>
              </div>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'}>
              <div className="flex flex-col gap-4">
                <HorizontalCardSkeleton className="w-32" />
                <span>Card na horizontal</span>
              </div>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'}>
              <div className="flex flex-col gap-4">
                <ShowcaseSkeleton className="w-32" />
                <span>Vitrine</span>
              </div>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'}>
              <div className="flex flex-col gap-4">
                <ButtonSkeleton className="w-32" />
                <span>Botão</span>
              </div>
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
