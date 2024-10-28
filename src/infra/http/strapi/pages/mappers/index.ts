import {
  AlignContent,
  CardType,
  Item,
  Media,
  Section
} from '@/application/entities';
import { GetPageResponse } from '@/application/modules/pages/entities';
import { toMediadomain } from '../../shared/mappers/indext';
import { StrapiMedia } from '../../shared/entities';

export interface RemotePage {
  name: string;
  slug: string;
  content: string;
  documentId: string;
  backgroundMedia: StrapiMedia;
  photoProfile: StrapiMedia;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  locale: string | null;
  whatsapp: string | null;
  discord: string | null;
  x: string | null;
  section_pages: Sectionpage[];
  page_items: any[];
}

interface Sectionpage {
  documentId: string;
  title: string;
  subtitle: null | string;
  alignContent: AlignContent;
  page_items: Pageitem[];
}

interface Pageitem {
  title: string;
  subtitle: string;
  link: string;
  documentId: string;
  type: CardType;
  image: StrapiMedia | null;
  publishedAt: Date | null;
}

export function toPageDomain({
  documentId,
  name,
  slug,
  content,
  backgroundMedia,
  section_pages,
  page_items,
  discord,
  facebook,
  instagram,
  linkedin,
  x,
  locale,
  whatsapp,
  photoProfile
}: RemotePage): GetPageResponse {
  return {
    id: documentId,
    name,
    slug,
    content,
    backgroundMedia: toMediadomain(backgroundMedia),
    photoProfile: toMediadomain(photoProfile),
    sectionsPages: section_pages?.map(toSectionPageDomain),
    items: page_items?.map(toPageItemDomain),
    discord: discord ? discord : undefined,
    instagram: instagram ? instagram : undefined,
    facebook: facebook ? facebook : undefined,
    x: x ? x : undefined,
    linkedin: linkedin ? linkedin : undefined,
    locationLink: locale ? locale : undefined,
    whatsapp: whatsapp ? whatsapp : undefined
  };
}

export function toSectionPageDomain({
  documentId,
  title,
  alignContent,
  subtitle,
  page_items
}: Sectionpage): Section {
  return {
    id: documentId,
    title,
    subtitle: subtitle ? subtitle : undefined,
    alignContent,
    items: page_items?.map(toPageItemDomain)
  };
}

export function toPageItemDomain({
  documentId,
  title,
  subtitle,
  image,
  link,
  type,
  publishedAt
}: Pageitem): Item {
  return {
    id: documentId,
    title,
    subtitle: subtitle ? subtitle : undefined,
    image: image ? toMediadomain(image) : undefined,
    type: type,
    link: link ? link : undefined,
    publishedAt
  };
}
