import {
  AlignContent,
  CardType,
  Item,
  Media,
  Page,
  Section
} from '@/application/entities';

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
  id?: string;
  slug?: string;
  name?: string;
  content?: string;
  instagram?: string;
  x?: string;
  site?: string;
  linkedin?: string;
  facebook?: string;
  locationLink?: string;
  whatsapp?: string;
  discord?: string;
  backgroundMedia?: string | number;
  photoProfile?: string | number;
  items?: string[];
  sections?: string[];
};

export type SectionSchema = {
  id?: string;
  title?: string;
  subtitle?: string;
  alignContent?: AlignContent;
  items?: string[];
  pageId?: string;
};

export type ItemSchema = {
  id?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  type?: CardType;
  image?: string | number;
  sectionId?: string;
  pageId?: string;
};
