import CreateIngredientFormDialog from '@/feature/ingredients/create-ingredient-form-dialog';
import IngredientsDataTable from '@/feature/ingredients/ingredient-data-table';

import { Button } from '@/ui/button';
import Search from '@/ui/search';

import { getDataOfTable } from '@/util/supabase.util';

interface IProps {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const RecipesPage = async ({ searchParams = {} }: IProps) => {
  const { data, page, perPage } = await getDataOfTable('ingredients')(
    searchParams['page'],
    searchParams['perPage'],
    searchParams['search'],
    'name',
  );

  return (
    <>
      <div className="flex w-full gap-2">
        <Search placeholder="Rechercher un ingrédient" />

        <CreateIngredientFormDialog>
          <Button variant="outline">Créer un ingrédient</Button>
        </CreateIngredientFormDialog>
      </div>

      <IngredientsDataTable ingredients={data} page={page} perPage={perPage} />
    </>
  );
};

export default RecipesPage;
