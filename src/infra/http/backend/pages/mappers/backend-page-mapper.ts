import { Item, Page, Section } from '@/application/entities';
import {
  BackendItem,
  BackendPage,
  BackendSection
} from '../etities/backend-pages-entities';
import { toMediaDomain } from '../../shared/mapper/backend-media-mapper';

export function toDomainSection(remoteSection: BackendSection): Section {
  const { subtitle, items } = remoteSection;
  return {
    ...remoteSection,
    subtitle: subtitle ? subtitle : undefined,
    items: items ? items.map(toDomainItem) : undefined
  };
}

export function toDomainItem(remoteItem: BackendItem): Item {
  const { subtitle, link, image } = remoteItem;
  return {
    ...remoteItem,
    subtitle: subtitle ? subtitle : undefined,
    link: link ? link : undefined,
    image: image ? toMediaDomain(image) : undefined
  };
}

export function toDomainPage(remotePage: BackendPage): Page {
  const {
    backgroundMedia,
    photoProfile,
    views,
    instagram,
    facebook,
    linkedin,
    discord,
    whatsapp,
    x,
    locationLink,
    site,
    items,
    sections
  } = remotePage;
  return {
    ...remotePage,
    views: views ? views : undefined,
    backgroundMedia: toMediaDomain(backgroundMedia),
    photoProfile: toMediaDomain(photoProfile),
    instagram: instagram ? instagram : undefined,
    facebook: facebook ? facebook : undefined,
    linkedin: linkedin ? linkedin : undefined,
    discord: discord ? discord : undefined,
    whatsapp: whatsapp ? whatsapp : undefined,
    x: x ? x : undefined,
    locationLink: locationLink ? locationLink : undefined,
    site: site ? site : undefined,
    items: items ? items.map(toDomainItem) : undefined,
    sectionsPages: sections ? sections.map(toDomainSection) : undefined
  };
}
