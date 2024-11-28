import { AlignContent, CardType } from '@/application/entities';
import { BackendMedia } from '../../shared/entities/backend-media-entities';

type BackendItemType = CardType;
type SectionAlignmentContent = AlignContent;

export interface BackendItem {
  id: string;
  title: string;
  subtitle: string | null;
  link?: string | null;
  type: BackendItemType;
  image: BackendMedia | null;
  publishedAt: Date;
}

export interface BackendSection {
  id: string;
  title: string;
  subtitle: string | null;
  alignContent: SectionAlignmentContent;
  items: BackendItem[] | null;
  publishedAt: Date;
}

export interface BackendPage {
  id: string;
  slug: string;
  name: string;
  content: string;
  instagram: string | null;
  x: string | null;
  site: string | null;
  linkedin: string | null;
  facebook: string | null;
  locationLink: string | null;
  whatsapp: string | null;
  discord: string | null;
  views: number | null;
  backgroundMedia: BackendMedia;
  photoProfile: BackendMedia;
  items: BackendItem[] | null;
  sections: BackendSection[] | null;
  publishedAt: Date;
}
