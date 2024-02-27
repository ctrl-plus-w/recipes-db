import React from 'react';

import Link from 'next/link';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/ui/button';

import { cn } from '@/util/style.util';

interface IProps {
  page: number;
  perPage: number;

  children?: React.ReactNode;
  className?: string;
}

const DataTableFooter = ({ children, className, page, perPage }: IProps) => {
  return (
    <div className={cn('flex items-center justify-end space-x-2', className)}>
      {children}

      <Button variant="outline" className={cn('h-8 w-8 p-0', page <= 1 && 'cursor-not-allowed')} asChild>
        <Link href={page <= 1 ? '#' : `/ingredients?page=${page - 1}&perPage=${perPage}`}>
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      </Button>

      <Button variant="outline" className="h-8 w-8 p-0" asChild>
        <Link href={`/ingredients?page=${page + 1}&perPage=${perPage}`}>
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default DataTableFooter;
