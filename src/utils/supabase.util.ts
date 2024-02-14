import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';

import supabase from '@/instance/database';

import { Database, Tables } from '@/type/database-generated.types';

export const getDataOfTable =
  <TableName extends keyof Database['public']['Tables']>(table: TableName) =>
    async (rawPage: unknown, rawPerPage: unknown, search?: unknown, column?: keyof Tables<TableName>) => {
      try {
        noStore();

        const page = Math.max(1, typeof rawPage === 'string' ? parseInt(rawPage) ?? 1 : 1);
        const perPage = Math.max(10, typeof rawPerPage === 'string' ? parseInt(rawPerPage) ?? 10 : 10);

        const from = (page - 1) * perPage;
        const to = page * perPage;

        let req = supabase.from(table).select('*').range(from, to);

        if (search && typeof search === 'string') req = req.textSearch(column as string, search);

        const { data } = await req;
        return { data: data ?? [], page, perPage };
      } catch (err) {
        return { data: [], page: 1, perPage: 10 };
      }
    };
