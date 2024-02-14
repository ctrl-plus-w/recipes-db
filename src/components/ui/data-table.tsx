'use client';

import { flexRender, Row, Table as TableType } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

interface DataTableProps<TData> {
  onTableRowClick?: (row: Row<TData>) => void;
  table: TableType<TData>;
}

export function DataTable<TData>({ table, onTableRowClick }: DataTableProps<TData>) {
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
                onClick={() => {
                  onTableRowClick && onTableRowClick(row);
                }}
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
