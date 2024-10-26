import { Item } from '@/application/entities';
import { clsx, type ClassValue } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(text: string): string {
  return text
    .normalize('NFD') // Normaliza para decompor acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase() // Converte para minúsculas
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais, exceto letras, números e espaços
    .trim() // Remove espaços em branco no início e no fim
    .replace(/\s+/g, '-'); // Substitui espaços por hífens
}

export function getImageURLByFile(file: File) {
  const url = URL.createObjectURL(file);
  return url;
}

export function groupByType(items: Item[]) {
  const groups: Item[][] = [];

  items.forEach((item) => {
    const { type } = item;

    const groupIndex = groups.findIndex((items) => {
      const foundType = items.find((currentItem) => type === currentItem.type);
      return foundType;
    });

    if (groupIndex !== -1) {
      groups[groupIndex].push(item);
    } else {
      groups.push([item]);
    }
  });

  return groups;
}
