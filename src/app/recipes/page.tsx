import CreateRecipeFormDialog from '@/module/create-recipe-form-dialog';
import RecipeDataTable from '@/module/recipe-data-table';

import { Button } from '@/ui/button';

import { getDataOfTable } from '@/util/supabase.util';

export const revalidate = 0;

interface IProps {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const RecipesPage = async ({ searchParams = {} }: IProps) => {
  const { data, page, perPage } = await getDataOfTable('recipes')(searchParams['page'], searchParams['perPage']);

  return (
    <>
      <CreateRecipeFormDialog>
        <Button variant="outline">Créer une recette</Button>
      </CreateRecipeFormDialog>

      <RecipeDataTable recipes={data} page={page} perPage={perPage} />
    </>
  );
};

export default RecipesPage;
