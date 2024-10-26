import { Media } from '@/application/entities';
import PageRepository from '../repository/page-repository';

export default class UploadMediaUsecase {
  constructor(private repository: PageRepository) {}

  async execute(media: File): Promise<Media> {
    const result = await this.repository.uploadMedia(media);
    return result;
  }
}
