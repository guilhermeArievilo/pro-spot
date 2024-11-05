import { groupByType } from '@/lib/utils';
import { notFound } from 'next/navigation';
import useSlugPageModel from './slug-page-model';
import PageScreen from '@/application/modules/pages/presentation/screens/page-screen/page-screen';

interface HomePageProps {
  params: {
    slug: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { getPageBySlug } = useSlugPageModel();

  const page = await getPageBySlug(params.slug);

  if (!page) return notFound();

  const groups = page.items?.length ? groupByType(page.items) : null;
  return <PageScreen page={page} groups={groups} />;
}
