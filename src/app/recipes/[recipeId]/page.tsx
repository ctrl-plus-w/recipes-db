import React from 'react';

import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ChevronRightIcon, ExternalLinkIcon, HardDriveDownloadIcon, UsersRoundIcon } from 'lucide-react';

import CreateIngredientForm from '@/module/create-ingredient-form';
import LoadOriginalIngredientsDialog from '@/module/load-original-ingredients-dialog';
import UpdateIngredientFormDialog from '@/module/update-ingredient-form-dialog';

import { Badge } from '@/ui/badge';

import supabase from '@/instance/database';

import { filterNotNull } from '@/util/array.util';

import { RecipeWithWeightedIngredients } from '@/type/database.types';

interface IProps {
  params: { recipeId: string };
}

const getData = async (recipeId: string) => {
  noStore();

  const { data: recipe, error: error1 } = await supabase.from('recipes').select('*').eq('id', recipeId).single();
  if (error1) return;

  const { data: joinIngredients, error: error2 } = await supabase
    .from('recipes__ingredients')
    .select('quantity, quantity_unit, ingredient:ingredients(*)')
    .eq('recipe_id', recipe.id);
  if (error2) return;

  const ingredients = filterNotNull(
    joinIngredients.map(({ ingredient, quantity, quantity_unit }) =>
      ingredient ? { ...ingredient, quantity, quantity_unit } : undefined,
    ),
  );

  return {
    ...recipe,
    ingredients,
  } satisfies RecipeWithWeightedIngredients;
};

const RecipePage = async ({ params: { recipeId } }: IProps) => {
  const recipe = await getData(recipeId);

  if (!recipe) return redirect('/recipes');

  return (
    <>
      <div className="w-full flex items-center gap-2 text-sm border-b py-4 mb-2">
        <Link href="/recipes">Recettes</Link>
        <ChevronRightIcon strokeWidth={2} width={20} height={20} />
        <p>{recipe.title}</p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Link href={recipe.url} target="_blank" className="mr-2">
          <ExternalLinkIcon width={32} height={32} />
        </Link>
        <h1 className="text-4xl">{recipe.title}</h1>
        <Badge className="text-md gap-1">
          {recipe.servings} <UsersRoundIcon strokeWidth={3} width={16} height={16} />
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-3xl">Ingrédients</h2>

        <LoadOriginalIngredientsDialog recipe={recipe}>
          <HardDriveDownloadIcon className="cursor-pointer" />
        </LoadOriginalIngredientsDialog>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <CreateIngredientForm recipe={recipe} />

        <div className="flex flex-col flex-grow flex-shrink-0">
          {recipe.ingredients
            .sort((i1, i2) => {
              if (i1.name == i2.name) return 0;
              return i1.name > i2.name ? 1 : -1;
            })
            .map((ingredient) => (
              <UpdateIngredientFormDialog recipe={recipe} ingredient={ingredient} key={ingredient.id}>
                <button className="flex flex-col items-start py-1 hover:bg-neutral-800">
                  <p>{ingredient.name}</p>
                  <p className="text-white/70">
                    {ingredient.quantity ?? '-'} <span>{ingredient.quantity_unit}</span>
                  </p>
                </button>
              </UpdateIngredientFormDialog>
            ))}
        </div>
      </div>

      <h2 className="text-3xl mt-8">Étapes</h2>

      {recipe.steps.map((step, index) => (
        <p className="text-white/70" key={index}>
          - {step}
        </p>
      ))}
    </>
  );
};

export default RecipePage;
