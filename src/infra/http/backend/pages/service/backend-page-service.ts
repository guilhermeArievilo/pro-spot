import axiosInstance from '@/infra/http/axiosService';
import BackendPagesRepository from '../repository/backend-pages-repository';
import { useEffect } from 'react';
import usePageModel from '@/application/modules/pages/presentation/models/page-model';

export default function useBackendPageService(jwtToken?: string) {
  const pageRepository = new BackendPagesRepository(axiosInstance);

  const pageModel = usePageModel({ pageRepository });

  function setJwtToken(token: string) {
    pageRepository.setToken(token);
  }

  useEffect(() => {
    if (jwtToken) {
      pageRepository.setToken(jwtToken);
    }
  }, [jwtToken]);

  return {
    ...pageModel,
    setJwtToken
  };
}
