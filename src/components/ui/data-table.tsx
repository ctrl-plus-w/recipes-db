'use client';

import { useRouter } from 'next/navigation';

import { flexRender, Row, Table as TableType } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

interface DataTableProps<TData> {
  table: TableType<TData>;
}

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  const router = useRouter();

  const onTableRowClick = (row: Row<TData>) => () => {
    const data = row.original;

    if (data && typeof data === 'object' && 'id' in data) router.push(`/recipes/${data.id}`);
  };

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={onTableRowClick(row)}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
