'use client';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import DataTableFooter from '@/module/data-table-footer';

import { DataTable } from '@/ui/data-table';

import { Tables } from '@/type/database-generated.types';

const columns: ColumnDef<Tables<'ingredients'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: "Nom de l'ingrédient",
  },
  {
    accessorKey: 'shelf_life',
    header: 'Durée de conservation',
    cell: ({ row }) => {
      const { shelf_life } = row.original;
      return shelf_life ? `${shelf_life} jours` : '-';
    },
  },
  {
    accessorKey: 'opened_shelf_life',
    header: 'Durée de conservation (ouvert)',
    cell: ({ row }) => {
      const { shelf_life } = row.original;
      return shelf_life ? `${shelf_life} jours` : '-';
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date de création',
  },
];

interface IProps {
  page: number;
  perPage: number;
  ingredients: Tables<'ingredients'>[];
}

const IngredientsDataTable = ({ page, perPage, ingredients }: IProps) => {
  const table = useReactTable({
    data: ingredients,
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

export default IngredientsDataTable;
