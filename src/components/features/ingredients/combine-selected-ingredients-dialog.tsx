import React, { MouseEventHandler, useState } from 'react';

import { useRouter } from 'next/navigation';

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
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { toast, useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { arrayToString } from '@/util/array.util';

import { Tables } from '@/type/database-generated.types';

interface IProps {
  ingredientsToCombine: Tables<'ingredients'>[];
  clearRowSelection: VoidFunction;

  children?: React.ReactNode;
}

const CombineSelectedIngredientsDialog = ({ clearRowSelection, ingredientsToCombine, children }: IProps) => {
  const router = useRouter();
  const { toastError } = useToast();

  const [destinationIngredient, setDestinationIngredient] = useState<Tables<'ingredients'>>(ingredientsToCombine[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onValueChange = (ingredientId: string) => {
    const ingredient = ingredientsToCombine.find((ingredient) => ingredient.id === ingredientId);
    if (ingredient) setDestinationIngredient(ingredient);
  };

  const onOpenChange = (_open: boolean) => {
    setIsOpen(_open);
  };

  const combineIngredients: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const ingredientsId = ingredientsToCombine.map((i) => i.id);
      const ingredientsIdWithoutDestinationOne = ingredientsId.filter((i) => i !== destinationIngredient.id);

      const { error: error1 } = await supabase
        .from('recipes__ingredients')
        .update({ ingredient_id: destinationIngredient.id })
        .in('ingredient_id', ingredientsId);
      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('ingredients')
        .delete()
        .in('id', ingredientsIdWithoutDestinationOne);
      if (error2) throw error2;

      toast({
        title: 'Les ingrédients ont bien été combinés',
        description: `Combination de ${arrayToString(
          ingredientsToCombine.map((ingredient) => ingredient.name),
          'fr',
        )} vers ${destinationIngredient.name}.`,
      });

      setIsOpen(false);
      clearRowSelection();
      router.refresh();
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes vous sur ?</AlertDialogTitle>
          <AlertDialogDescription>
            La combinaison des ingrédients signifie la suppression d&apos;un des deux ingrédients. Combinaison de{' '}
            <strong className="text-neutral-200">
              {arrayToString(
                ingredientsToCombine.map((ingredient) => ingredient.name),
                'fr',
              )}
            </strong>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RadioGroup onValueChange={onValueChange} defaultValue={ingredientsToCombine[0].id}>
          {ingredientsToCombine.map((ingredient) => (
            <div className="flex items-center space-x-2" key={ingredient.id}>
              <RadioGroupItem value={ingredient.id} id={ingredient.id} />
              <Label htmlFor={ingredient.id}>{ingredient.name}</Label>
            </div>
          ))}
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={combineIngredients}>
            Combiner
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CombineSelectedIngredientsDialog;
