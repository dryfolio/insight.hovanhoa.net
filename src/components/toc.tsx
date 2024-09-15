import { type TableOfContent } from '@/lib/types';
import Link from 'next/link';
import React from 'react';

export default function TableOfContent({ items }: { items: TableOfContent[] }) {

  return (
    <div className='text-sm leading-7 text-slate-500 prose'>
      {items.map(item => {
        if (item.level === 1 || item.level === 2) {
          return (
            <div
              className='content-block'
              key={item.id} style={{ paddingBottom: 3 }}>
              <div className="feed-border"></div>
              <div className="feed-dot"></div>
              <Link
                className='no-underline text-sm text-slate-500 font-normal'
                href={`#heading-${item.slug}`}>{item.title}</Link>
            </div>
          );
        }
      })}
    </div>
  );
}
