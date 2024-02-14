'use client';

import { useState } from 'react';

import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import DataTableFooter from '@/module/data-table-footer';
import UpdateIngredientFormDialog from '@/module/update-ingredient-form-dialog';

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
  const [updatingIngredient, setUpdatingIngredient] = useState<Tables<'ingredients'> | undefined>();

  const table = useReactTable({
    data: ingredients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onTableRowClick = (row: Row<Tables<'ingredients'>>) => {
    setUpdatingIngredient(row.original);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <UpdateIngredientFormDialog
        isOpen={!!updatingIngredient}
        setIsOpen={() => setUpdatingIngredient(undefined)}
        ingredient={updatingIngredient}
      />

      <DataTable table={table} onTableRowClick={onTableRowClick} />
      <DataTableFooter page={page} perPage={perPage} />
    </div>
  );
};

export default IngredientsDataTable;
