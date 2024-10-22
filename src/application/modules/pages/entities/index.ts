import { CardType, Item, Media, Section } from '@/application/entities';

export type GetPageResponse = {
  id: string;
  slug: string;
  name: string;
  content: string;
  backgroundMedia: Media;
  photoProfile: Media;
  instagram?: string;
  x?: string;
  site?: string;
  linkedin?: string;
  facebook?: string;
  locationLink?: string;
  whatsapp?: string;
  discord?: string;
  sectionsPages?: Section[];
  items?: Item[];
};

export type PageSchema = {
  id: string;
  slug: string;
  name: string;
  content: string;
  instagram?: string;
  x?: string;
  site?: string;
  linkedin?: string;
  facebook?: string;
  locationLink?: string;
  whatsapp?: string;
  discord?: string;
  backgroundMedia?: File;
  photoProfile?: File;
};

export type ItemSchema = {
  id?: string;
  title: string;
  subtitle?: string;
  link?: string;
  type: CardType;
  image?: File;
};
