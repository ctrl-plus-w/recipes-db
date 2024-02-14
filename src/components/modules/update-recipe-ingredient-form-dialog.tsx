'use client';

import React, {
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import InvisibleInput from '@/ui/invisible-input';
import { useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { RecipeWithWeightedIngredients, Tables, WeightedIngredient } from '@/type/database.types';

interface IProps {
  recipe: Tables<'recipes'> | RecipeWithWeightedIngredients;
  ingredient: WeightedIngredient;

  className?: string;
  children?: React.ReactNode;
}

interface IFormProps {
  recipe: Tables<'recipes'> | RecipeWithWeightedIngredients;
  ingredient: WeightedIngredient;

  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateRecipeIngredientForm = ({ setIsOpen, recipe, ingredient }: IFormProps) => {
  const { toast, toastError } = useToast();

  const router = useRouter();

  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('');

  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const onQuantityChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const num = parseFloat(event.target.value);
    if (num > 0 || isNaN(num)) setQuantity(num);
  };

  const onUnitChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setUnit(event.target.value);
  };

  useEffect(() => {
    if (ingredient.quantity) setQuantity(ingredient.quantity);
    if (ingredient.quantity_unit) setUnit(ingredient.quantity_unit);
  }, [ingredient]);

  const isDisabled = useMemo(() => {
    if (ingredient.quantity !== quantity) return false;
    return ingredient.quantity_unit === unit;
  }, [ingredient, quantity, unit]);

  const onRemove: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    try {
      setIsRemoveLoading(true);

      const { error } = await supabase
        .from('recipes__ingredients')
        .delete()
        .eq('recipe_id', recipe.id)
        .eq('ingredient_id', ingredient.id);
      if (error) throw error;

      toast({ title: "Suppression de l'ingrédient", description: "L'ingrédient à bien été supprimé." });

      startTransition(() => {
        setIsOpen(false);
        router.refresh();
      });
    } catch (err) {
      toastError(err);
    } finally {
      setIsRemoveLoading(false);
    }
  };

  const onUpdate: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    try {
      setIsUpdateLoading(true);

      const _quantity = quantity <= 0 ? null : quantity;
      const _quantity_unit = unit === '' ? null : unit;

      const { error } = await supabase
        .from('recipes__ingredients')
        .update({ quantity: _quantity, quantity_unit: _quantity_unit })
        .eq('recipe_id', recipe.id)
        .eq('ingredient_id', ingredient.id);
      if (error) throw error;

      toast({ title: "Modification de l'ingrédient", description: "L'ingrédient à bien été modifié." });

      startTransition(() => {
        setIsOpen(false);
        router.refresh();
      });
    } catch (err) {
      toastError(err);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <InvisibleInput
          value={isNaN(quantity) ? '' : quantity.toString()}
          onChange={onQuantityChange}
          placeholder={ingredient.quantity?.toString() ?? '1'}
        />

        <InvisibleInput value={unit} onChange={onUnitChange} placeholder={ingredient.quantity_unit ?? 'unite'} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <AlertDialogAction onClick={onRemove} variant="destructive" className="mr-auto" disabled={isRemoveLoading}>
          {isRemoveLoading ? <Loader2Icon className="animate-spin" /> : 'Retirer la recette'}
        </AlertDialogAction>

        <AlertDialogCancel onClick={close}>Annuler</AlertDialogCancel>
        <AlertDialogAction onClick={onUpdate} disabled={isDisabled || isUpdateLoading}>
          {isUpdateLoading ? <Loader2Icon className="animate-spin" /> : 'Valider'}
        </AlertDialogAction>
      </div>
    </div>
  );
};

const UpdateRecipeIngredientFormDialog = ({ ingredient, recipe, children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ingredient.name}</AlertDialogTitle>
          <AlertDialogDescription>Formulaire de modification d&apos;un ingrédient.</AlertDialogDescription>
        </AlertDialogHeader>

        <UpdateRecipeIngredientForm recipe={recipe} ingredient={ingredient} setIsOpen={setIsOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateRecipeIngredientFormDialog;
