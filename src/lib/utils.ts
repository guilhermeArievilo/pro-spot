import { clsx, type ClassValue } from 'clsx';
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
