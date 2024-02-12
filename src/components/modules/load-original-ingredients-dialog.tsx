'use server';

import React from 'react';

import { unstable_noStore as noStore } from 'next/cache';

import LoadOriginalIngredients from '@/module/load-original-ingredients-form';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';

import Api from '@/class/MarmitonApi';

import supabase from '@/instance/database';

import { RecipeWithWeightedIngredients } from '@/type/database.types';

interface IProps {
  recipe: RecipeWithWeightedIngredients;

  children?: React.ReactNode;
}

const getData = async (recipeUrl: string) => {
  noStore();

  const marmitonRecipe = await Api.getDetailedRecipe(recipeUrl);

  const ingredientsWithAvailabilities = await Promise.all(
    marmitonRecipe.ingredients.map(async (ingredient) => {
      const { data } = await supabase
        .from('ingredients')
        .select()
        .textSearch('name', ingredient.name, { type: 'phrase' });

      return [ingredient, data ?? []] as const;
    }),
  );

  return { marmitonRecipe, ingredientsWithAvailabilities };
};

const LoadOriginalIngredientsDialog = async ({ recipe, children }: IProps) => {
  const { ingredientsWithAvailabilities } = await getData(recipe.url);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Récupération des ingrédients sur marmiton</AlertDialogTitle>
          <AlertDialogDescription>La liste des ingrédients récupérés à partir du site marmiton.</AlertDialogDescription>
        </AlertDialogHeader>

        <LoadOriginalIngredients recipe={recipe} ingredientsWithAvailabilities={ingredientsWithAvailabilities} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoadOriginalIngredientsDialog;
