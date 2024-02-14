'use client';

import React, { Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import { AlertDialogAction, AlertDialogCancel } from '@/ui/alert-dialog';
import { Button } from '@/ui/button';
import Ingredient from '@/ui/ingredient';
import { useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { filterNotNull } from '@/util/array.util';
import { capitalizeSentence } from '@/util/string.util';

import { TablesInsert } from '@/type/database-generated.types';
import { Tables, WeightedIngredient } from '@/type/database.types';

interface IProps {
  recipe: Tables<'recipes'>;

  ingredientsWithAvailabilities: (readonly [WeightedIngredient, Tables<'ingredients'>[]])[];
}

const LoadOriginalIngredientsForm = ({
  recipe,
  ingredientsWithAvailabilities: _ingredientsWithAvailabilities,
}: IProps) => {
  const { toastError } = useToast();

  const [ingredientsWithAvailabilities, setIngredientsWithAvailabilities] = useState(_ingredientsWithAvailabilities);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [isReplacementDisabledIds, setIsReplacementDisabledIds] = useState<string[]>([]);
  const [isDisabledIds, setIsDisabledIds] = useState<string[]>([]);
  const [mappedNames, setMappedNames] = useState<Record<string, string>>({});

  useEffect(() => {
    setIngredientsWithAvailabilities(_ingredientsWithAvailabilities);
  }, [_ingredientsWithAvailabilities]);

  const switchIsValue =
    (values: string[], setValues: Dispatch<SetStateAction<string[]>>) => (ingredient: WeightedIngredient) => () => {
      const id = ingredient.id;

      if (values.includes(id)) setValues((ids) => ids.filter((_id) => _id !== id));
      else setValues((ids) => [...ids, id]);
    };

  const setMappedName = (ingredient: WeightedIngredient) => (mappedName: string) => {
    setMappedNames((mappedNames) => ({ ...mappedNames, [ingredient.id]: mappedName }));
  };

  const switchIsReplaced = switchIsValue(isReplacementDisabledIds, setIsReplacementDisabledIds);
  const switchIsDisabled = switchIsValue(isDisabledIds, setIsDisabledIds);

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const enabledIngredientsWithAvailabilities = ingredientsWithAvailabilities.filter(
        ([ingredient]) => !isDisabledIds.includes(ingredient.id),
      );

      const ingredientsToCreate = enabledIngredientsWithAvailabilities
        .filter(
          ([ingredient, availableIngredients]) =>
            isReplacementDisabledIds.includes(ingredient.id) || !availableIngredients.length,
        )
        .map(
          ([ingredient]) =>
            ({
              name: ingredient.id in mappedNames ? mappedNames[ingredient.id] : capitalizeSentence(ingredient.name),

              opened_shelf_life: ingredient.opened_shelf_life,
              shelf_life: ingredient.shelf_life,
            }) satisfies TablesInsert<'ingredients'>,
        );

      const ingredientsToReuse = enabledIngredientsWithAvailabilities
        .filter(([ingredient, availableIngredients]) => {
          return availableIngredients.length && !isReplacementDisabledIds.includes(ingredient.id);
        })
        .map(([_, availableIngredients]) => availableIngredients[0]);

      const { data: createdIngredients, error: error1 } = await supabase
        .from('ingredients')
        .insert(ingredientsToCreate)
        .select();
      if (error1) throw error1;

      const ingredientsToJoin = [...createdIngredients, ...ingredientsToReuse];

      const recipesIngredients = filterNotNull(
        ingredientsToJoin.map((ingredient) => {
          // ! Careful, the weight are retrieved by the name of the ingredients. That could cause bugs.
          const weightedIngredientWithAvailabilities = ingredientsWithAvailabilities.find(
            ([{ name }]) => capitalizeSentence(ingredient.name) === capitalizeSentence(name),
          );
          if (!weightedIngredientWithAvailabilities) return;

          const weightedIngredient = weightedIngredientWithAvailabilities[0];

          return {
            ingredient_id: ingredient.id,
            recipe_id: recipe.id,
            quantity: weightedIngredient.quantity,
            quantity_unit: weightedIngredient.quantity_unit,
          } satisfies TablesInsert<'recipes__ingredients'>;
        }),
      );

      const { error: error2 } = await supabase.from('recipes__ingredients').insert(recipesIngredients);
      if (error2) throw error2;

      router.refresh();
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-1 h-full overflow-hidden" onSubmit={onSubmit}>
      <div className="h-full overflow-scroll">
        {ingredientsWithAvailabilities.map(([ingredient, availableIngredients]) => (
          <Ingredient
            key={ingredient.id}
            {...{
              ingredient,
              availableIngredients,
              setIngredientsWithAvailabilities,

              mappedName: mappedNames[ingredient.id],
              setMappedName: setMappedName(ingredient),

              isDisabled: isDisabledIds.includes(ingredient.id),
              switchIsDisabled: switchIsDisabled(ingredient),

              isReplacedDisabled: isReplacementDisabledIds.includes(ingredient.id),
              switchIsReplacedDisabled: switchIsReplaced(ingredient),
            }}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
        <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button type="submit">{isLoading ? <Loader2Icon className="animate-spin" /> : 'Valider la création'}</Button>
        </AlertDialogAction>
      </div>
    </form>
  );
};

export default LoadOriginalIngredientsForm;
