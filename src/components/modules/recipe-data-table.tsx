'use client';

import { useRouter } from 'next/navigation';

import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
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
  const router = useRouter();

  const table = useReactTable({
    data: recipes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onTableRowClick = (row: Row<Tables<'recipes'>>) => {
    const data = row.original;

    if (data && typeof data === 'object' && 'id' in data) router.push(`/recipes/${data.id}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <DataTable table={table} onTableRowClick={onTableRowClick} />
      <DataTableFooter page={page} perPage={perPage}></DataTableFooter>
    </div>
  );
};

export default RecipeDataTable;
