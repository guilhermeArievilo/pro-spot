import PageRepository from '../../repository/page-repository';
import UploadMediaUsecase from '../../usecases/upload-media-usecase';

interface useMediaModelProps {
  pageRepository: PageRepository;
}

export default function useMediaModel({ pageRepository }: useMediaModelProps) {
  async function uploadMedia(media: File) {
    const uploadMediaCase = new UploadMediaUsecase(pageRepository);

    return await uploadMediaCase.execute(media);
  }
  return {
    uploadMedia
  };
}
