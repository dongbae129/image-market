const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const q = quality || 75;
  //   if (process.env.NODE_ENV === 'development') {
  //     return src;
  //   }
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  //   return `https://imagedelivery.net/bNDb4K-aoDT2BhrWGZ8Gbw/${src}/public?w=${width}&q=${q}&auto=webp`;
  return `${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/cdn-cgi/image/w=${width},q=${q},format=auto/${src}`;
}
