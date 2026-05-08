/* eslint-disable @next/next/no-img-element */

type TextbookImageProps = {
  src: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export function TextbookImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: TextbookImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  )
}
