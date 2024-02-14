'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import DataTableFooter from '@/module/data-table-footer';

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
  page: number;
  perPage: number;
  recipes: Tables<'recipes'>[];
}

const RecipeDataTable = ({ page, perPage, recipes }: IProps) => {
  const table = useReactTable({
    data: recipes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <DataTable table={table} />
      <DataTableFooter page={page} perPage={perPage}></DataTableFooter>
    </div>
  );
};

export default RecipeDataTable;
