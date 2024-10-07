import { z } from 'zod';

export const mediaObjectSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string().optional(),
  width: z.number(),
  height: z.number(),
  mime: z.string().optional()
});

export type Media = z.infer<typeof mediaObjectSchema>;

export type Item = {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  type: CardType;
  image?: Media;
};

export type CardType = 'row' | 'col' | 'banner' | 'showcase' | 'button';

export type AlignContent = 'center' | 'start';

export type Section = {
  id: string;
  title: string;
  subtitle?: string;
  alignContent: AlignContent;
  items?: Item[];
};

export type Page = {
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
