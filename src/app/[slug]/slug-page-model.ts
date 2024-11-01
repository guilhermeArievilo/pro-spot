import usePageModel from '@/application/modules/pages/presentation/models/page-model';
import { getClient } from '@/infra/http/apolloService';
import axiosInstance from '@/infra/http/axiosService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';

export default function useSlugPageModel() {
  const strapiPageRepository = new StrapiPagesApiRepository(
    getClient(),
    axiosInstance
  );

  const { getPageBySlug } = usePageModel({
    pageRepository: strapiPageRepository
  });
  return { getPageBySlug };
}
