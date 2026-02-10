'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    if (items) {
      setBreadcrumbs(items);
      return;
    }

    // Auto-generate breadcrumbs from pathname
    const segments = pathname.split('/').filter(Boolean);
    const generated: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      generated.push({ label, href });
    });

    setBreadcrumbs(generated);
  }, [pathname, items]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href || index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600 mx-1" />
            )}
            {breadcrumb.href && index < breadcrumbs.length - 1 ? (
              <Link
                href={breadcrumb.href}
                className={cn(
                  'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300',
                  'transition-colors duration-200'
                )}
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
