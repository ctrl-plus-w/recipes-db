'use client';

import React, { MouseEventHandler, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import { useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { RecipeWithWeightedIngredients, Tables } from '@/type/database.types';

interface IProps {
  recipe: Tables<'recipes'> | RecipeWithWeightedIngredients;
  children?: React.ReactNode;
}

const DeleteRecipeDialog = ({ recipe, children }: IProps) => {
  const { toast, toastError } = useToast();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const deleteRecipe: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const { error } = await supabase.from('recipes').delete().eq('id', recipe.id);
      if (error) throw error;

      toast({
        title: 'Recette supprimée',
        description: (
          <>
            La recette <strong>{recipe.title}</strong> a bien été supprimée.
          </>
        ),
      });

      router.push('/recipes');
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la recette</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes vous sur de vouloir supprimer la recette : <strong>{recipe.title}</strong> ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRecipe} variant="destructive" disabled={isLoading}>
            {isLoading ? <Loader2Icon className="animate-spin" /> : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecipeDialog;
