import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const timesNewRoman = {
  fontFamily: '"Times New Roman", Times, serif',
  letterSpacing: 0,
}

export function WolfWhaleBrand({
  href,
  logoSrc = '/logo.png',
  logoSize = 56,
  className,
  markClassName,
  textClassName,
  taglineClassName,
  priority = false,
}: {
  href?: string
  logoSrc?: string
  logoSize?: number
  className?: string
  markClassName?: string
  textClassName?: string
  taglineClassName?: string
  priority?: boolean
}) {
  const content = (
    <>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white p-1 shadow-sm',
          markClassName
        )}
        style={{ width: logoSize, height: logoSize }}
        aria-hidden="true"
      >
        <Image
          src={logoSrc}
          alt=""
          width={logoSize}
          height={logoSize}
          sizes={`${logoSize}px`}
          className="h-full w-full object-contain"
          priority={priority}
          loading={priority ? 'eager' : undefined}
        />
      </span>
      <span className="min-w-0" style={timesNewRoman}>
        <span
          className={cn(
            'block text-xl font-bold leading-none text-slate-950 dark:text-white',
            textClassName
          )}
        >
          WolfWhale
        </span>
        <span
          className={cn(
            'mt-1 block text-xs font-normal leading-tight text-slate-600 dark:text-white/70',
            taglineClassName
          )}
        >
          Learning Management System
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-label="WolfWhale Learning Management System"
        className={cn('inline-flex items-center gap-3', className)}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      aria-label="WolfWhale Learning Management System"
      className={cn('inline-flex items-center gap-3', className)}
    >
      {content}
    </div>
  )
}
