import IngredientsDataTable from '@/module/ingredient-data-table';

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
  const { data, page, perPage } = await getDataOfTable('ingredients')(searchParams['page'], searchParams['perPage']);

  return (
    <>
      {/*<CreateRecipeFormDialog>*/}
      {/*  <Button variant="outline">Créer une recette</Button>*/}
      {/*</CreateRecipeFormDialog>*/}

      <IngredientsDataTable ingredients={data} page={page} perPage={perPage} />
    </>
  );
};

export default RecipesPage;
