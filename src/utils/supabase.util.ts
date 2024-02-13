import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';

import supabase from '@/instance/database';

import { Database } from '@/type/database-generated.types';

export const getDataOfTable =
  <PublicTableNameOrOptions extends keyof Database['public']['Tables']>(table: PublicTableNameOrOptions) =>
    async (rawPage: unknown, rawPerPage: unknown) => {
      try {
        noStore();

        const page = Math.max(1, typeof rawPage === 'string' ? parseInt(rawPage) ?? 1 : 1);
        const perPage = Math.max(10, typeof rawPerPage === 'string' ? parseInt(rawPerPage) ?? 10 : 10);

        const from = (page - 1) * perPage;
        const to = page * perPage;

        const { data } = await supabase.from(table).select('*').range(from, to);
        return data ?? [];
      } catch (err) {
        return [];
      }
    };
