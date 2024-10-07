import { Media } from '@/application/entities';
import { StrapiMedia } from '../entities';
import getImageUrl from '@/lib/loader';

export function toMediadomain({
  url,
  height,
  width,
  alternativeText,
  mime,
  documentId
}: StrapiMedia): Media {
  return {
    id: documentId,
    src: getImageUrl(url),
    height,
    width,
    alt: alternativeText,
    mime
  };
}
