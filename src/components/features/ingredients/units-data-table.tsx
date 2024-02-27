'use client';

import { useState } from 'react';

import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';

import UpdateUnitFormDialog from '@/feature/ingredients/update-unit-form-dialog';

import DataTableFooter from '@/module/data-table-footer';

import { DataTable } from '@/ui/data-table';

import { Tables } from '@/type/database-generated.types';

const columns: ColumnDef<Tables<'units'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'singular',
    header: 'Nom (au singulier)',
  },
  {
    accessorKey: 'plural',
    header: 'Nom (au pluriel)',
  },
  {
    accessorKey: 'created_at',
    header: 'Date de création',
  },
  {
    accessorKey: 'aliases',
    header: 'Alias',
    cell: ({ row }) => {
      return row.original.aliases.length ? row.original.aliases.join(', ') : '-';
    },
  },
];

interface IProps {
  page: number;
  perPage: number;
  units: Tables<'units'>[];
}

const UnitsDataTable = ({ page, perPage, units }: IProps) => {
  const [updatingUnit, setUpdatingUnit] = useState<Tables<'units'> | undefined>();

  const table = useReactTable({
    data: units,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onTableRowClick = (row: Row<Tables<'units'>>) => {
    setUpdatingUnit(row.original);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <UpdateUnitFormDialog isOpen={!!updatingUnit} setIsOpen={() => setUpdatingUnit(undefined)} unit={updatingUnit} />

      <DataTable table={table} onTableRowClick={onTableRowClick} />

      <DataTableFooter page={page} perPage={perPage} />
    </div>
  );
};

export default UnitsDataTable;
