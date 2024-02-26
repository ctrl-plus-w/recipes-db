import CreateUnitFormDialog from '@/feature/ingredients/create-unit-form-dialog';
import UnitsDataTable from '@/feature/ingredients/units-data-table';

import { Button } from '@/ui/button';

import { getDataOfTable } from '@/util/supabase.util';

interface IProps {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const UnitsPage = async ({ searchParams = {} }: IProps) => {
  const { data, page, perPage } = await getDataOfTable('units')(searchParams['page'], searchParams['perPage']);

  return (
    <>
      <div className="flex w-full gap-2">
        <CreateUnitFormDialog>
          <Button variant="outline">Créer une unité</Button>
        </CreateUnitFormDialog>
      </div>

      <UnitsDataTable units={data} page={page} perPage={perPage} />
    </>
  );
};

export default UnitsPage;
