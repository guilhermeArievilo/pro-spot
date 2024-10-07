export default function getImageUrl(src: string): string {
  if (src == null) return '';
  if (src.startsWith('data:')) return src;
  if (src.startsWith('http') || src.startsWith('//')) return src;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${src}`;
}
