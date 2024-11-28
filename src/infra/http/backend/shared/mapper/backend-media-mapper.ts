import { Media } from '@/application/entities';
import { BackendMedia } from '../entities/backend-media-entities';
import getImageUrl from '@/lib/loader';

export function toMediaDomain({
  id,
  name,
  url,
  height,
  mimeType,
  width
}: BackendMedia): Media {
  return {
    id,
    src: getImageUrl(url),
    height,
    width,
    alt: name,
    mime: mimeType
  };
}

export function toMediaRemote({
  id,
  src,
  alt,
  mime,
  height,
  width
}: Media): BackendMedia {
  return {
    id: id.toString(),
    url: src,
    name: alt!,
    mimeType: mime!,
    height,
    width
  };
}
