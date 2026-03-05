'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { TextDataSource } from './text-data-source'

interface StaticCardProps {
  title?: string
  source?: string
  url: {
    light: string
    dark: string
  }
  className?: string
  extra?: React.ReactNode
}

export function StaticCard({
  title,
  source,
  url,
  className,
  extra,
}: StaticCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm',
        className,
      )}
    >
      {title ? <div className="mb-4 sm:mb-5 font-bold text-sm sm:text-base">{title}</div> : null}

      <div className="block flex flex-col items-stretch dark:hidden">
        <Image
          alt={title || ''}
          height={500}
          loader={({ src }) => src}
          src={url.light}
          unoptimized
          width={800}
          className="w-full h-auto"
        />
      </div>

      <div className="flex hidden flex-col gap-5 dark:block">
        <Image
          alt={title || ''}
          height={500}
          src={url.dark}
          unoptimized
          width={800}
          className="w-full h-auto"
        />
      </div>

      {extra}

      <TextDataSource>{source}</TextDataSource>
    </div>
  )
}

export default StaticCard
