import CreateRecipeFormDialog from '@/module/CreateRecipeFormDialog';
import RecipesDataTable from '@/module/RecipesDataTable';

import { Button } from '@/ui/button';

import supabase from '@/instance/database';

import { Tables } from '@/type/database-generated.types';

export const revalidate = 0;

const getData = async (rawPage: unknown, rawPerPage: unknown): Promise<Tables<'recipes'>[]> => {
  try {
    const page = Math.max(1, typeof rawPage === 'string' ? parseInt(rawPage) ?? 1 : 1);
    const perPage = Math.max(10, typeof rawPerPage === 'string' ? parseInt(rawPerPage) ?? 10 : 10);

    const from = (page - 1) * perPage;
    const to = page * perPage;

    const { data } = await supabase.from('recipes').select('*').range(from, to);
    return data ?? [];
  } catch (err) {
    return [];
  }
};

interface IProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const RecipesPage = async ({ searchParams = {} }: IProps) => {
  const data = await getData(searchParams['page'], searchParams['perPage']);

  return (
    <>
      <CreateRecipeFormDialog>
        <Button variant="outline">Créer une recette</Button>
      </CreateRecipeFormDialog>

      <RecipesDataTable recipes={data} />
    </>
  );
};

export default RecipesPage;
