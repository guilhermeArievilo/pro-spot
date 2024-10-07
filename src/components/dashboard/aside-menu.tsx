'use client';
import Link from 'next/link';
import EditPage from '@/assets/svg/icons/edit-page.svg';
import TrendingUp from '@/assets/svg/icons/trending-up.svg';
import Bell from '@/assets/svg/icons/bell.svg';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
export function AsideMenu() {
  const pathname = usePathname();
  return (
    <aside className="p-2 h-full">
      <nav className="flex flex-col gap-4">
        <Link
          className={cn(
            'p-4 dark:hover:bg-dark-surfaceContainer hover:bg-light-surfaceContainer rounded-xl hover:-translate-y-1 transition-all ease-in-out',
            {
              'dark:bg-dark-inverseSurface bg-light-inverseSurface hover:dark:bg-dark-inverseSurface hover:bg-light-inverseSurface':
                pathname === '/dashboard'
            }
          )}
          href={'/dashboard'}
        >
          <EditPage
            className={cn('h-6 w-6 stroke-foreground', {
              'dark:stroke-dark-inverseOnSurface stroke-light-inverseOnSurface':
                pathname === '/dashboard'
            })}
          />
        </Link>
        <button
          className={cn(
            'p-4 dark:hover:bg-dark-surfaceContainer hover:bg-light-surfaceContainer rounded-xl hover:-translate-y-1 transition-all ease-in-out'
          )}
          type="button"
        >
          <Bell className="h-6 w-6 stroke-foreground" />
        </button>
        <Link
          className={cn(
            'p-4 dark:hover:bg-dark-surfaceContainer hover:bg-light-surfaceContainer rounded-xl hover:-translate-y-1 transition-all ease-in-out',
            {
              'dark:bg-dark-inverseSurface bg-light-inverseSurface':
                pathname === '/dashboard/trendigs'
            }
          )}
          href={'/dashboard/trendigs'}
        >
          <TrendingUp
            className={cn('h-6 w-6 stroke-foreground', {
              'dark:stroke-dark-inverseOnSurface stroke-light-inverseOnSurface':
                pathname === '/dashboard/trendigs'
            })}
          />
        </Link>
      </nav>
    </aside>
  );
}
