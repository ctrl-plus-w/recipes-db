'use client';

import { useState } from 'react';

import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import CombineSelectedIngredientsDialog from '@/feature/ingredients/combine-selected-ingredients-dialog';
import UpdateIngredientFormDialog from '@/feature/ingredients/update-ingredient-form-dialog';

import DataTableFooter from '@/module/data-table-footer';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { DataTable } from '@/ui/data-table';

import { Tables } from '@/type/database-generated.types';

const columns: ColumnDef<Tables<'ingredients'>>[] = [
  {
    id: 'select',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data: ingredients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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

      <DataTableFooter page={page} perPage={perPage}>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <CombineSelectedIngredientsDialog
            ingredientsToCombine={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            clearRowSelection={() => setRowSelection({})}
          >
            <Button className="mr-auto">Combiner les ingrédients sélectionnés</Button>
          </CombineSelectedIngredientsDialog>
        )}
      </DataTableFooter>
    </div>
  );
};

export default IngredientsDataTable;
