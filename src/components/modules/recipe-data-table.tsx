'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import { DataTable } from '@/ui/data-table';

import { Tables } from '@/type/database-generated.types';

const columns: ColumnDef<Tables<'recipes'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Nom de la recette',
  },
  {
    accessorKey: 'servings',
    header: 'Nombre de portions',
  },
  {
    accessorKey: 'created_at',
    header: 'Date de création',
  },
];

interface IProps {
  recipes: Tables<'recipes'>[];
}

const RecipeDataTable = ({ recipes }: IProps) => {
  const table = useReactTable({
    data: recipes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <DataTable table={table} />

      {/*TODO: Make the pagination work (redirecting to the page with a query param instead of using buttons). */}
      {/*<div className="flex items-center space-x-2">*/}
      {/*  <Button*/}
      {/*    variant="outline"*/}
      {/*    className="hidden h-8 w-8 p-0 lg:flex"*/}
      {/*    onClick={() => table.setPageIndex(0)}*/}
      {/*    disabled={!table.getCanPreviousPage()}*/}
      {/*  >*/}
      {/*    <span className="sr-only">Go to first page</span>*/}
      {/*    <ChevronsLeftIcon className="h-4 w-4" />*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    variant="outline"*/}
      {/*    className="h-8 w-8 p-0"*/}
      {/*    onClick={() => table.previousPage()}*/}
      {/*    disabled={!table.getCanPreviousPage()}*/}
      {/*  >*/}
      {/*    <span className="sr-only">Go to previous page</span>*/}
      {/*    <ChevronLeftIcon className="h-4 w-4" />*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    variant="outline"*/}
      {/*    className="h-8 w-8 p-0"*/}
      {/*    onClick={() => table.nextPage()}*/}
      {/*    disabled={!table.getCanNextPage()}*/}
      {/*  >*/}
      {/*    <span className="sr-only">Go to next page</span>*/}
      {/*    <ChevronRightIcon className="h-4 w-4" />*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    variant="outline"*/}
      {/*    className="hidden h-8 w-8 p-0 lg:flex"*/}
      {/*    onClick={() => table.setPageIndex(table.getPageCount() - 1)}*/}
      {/*    disabled={!table.getCanNextPage()}*/}
      {/*  >*/}
      {/*    <span className="sr-only">Go to last page</span>*/}
      {/*    <ChevronsRightIcon className="h-4 w-4" />*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
};

export default RecipeDataTable;
