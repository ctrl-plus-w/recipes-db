'use client';

import React, { FormEventHandler, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import { AlertDialogAction, AlertDialogCancel } from '@/ui/alert-dialog';
import { Button } from '@/ui/button';
import Ingredient from '@/ui/ingredient';
import { useToast } from '@/ui/use-toast';

import useUnits from '@/hook/use-units';

import supabase from '@/instance/database';

import { filterNotNull, unique } from '@/util/array.util';
import { switchIsValue } from '@/util/react.util';
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

  const units = useUnits();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Replaced ingredients are ingredients that are replaced by another one (shown as struck with an arrow pointing
  // towards to replacing ingredient.)
  const [isReplacementDisabledIds, setIsReplacementDisabledIds] = useState<string[]>([]);

  // Disabled ingredients are the one not include in the recipe.
  const [isDisabledIds, setIsDisabledIds] = useState<string[]>([]);

  // Mapped names are the names to replace the current names of the elements by (only used when creating ingredients).
  // Mapping the ingredient id with its new name i.e { 'ingredient-id': 'carrot' }
  const [mappedNames, setMappedNames] = useState<Record<string, string>>({});

  /**
   * Composite function to find the matching unit from an ingredient.
   * @param units The list of units to search in.
   */
  const findMatchingUnitFromIngredient = (units: Tables<'units'>[]) => {
    return ({ unit }: WeightedIngredient) => {
      if (!unit) return;

      const { singular, plural } = unit;

      return units.find((_unit) => {
        return (
          _unit.singular === singular ||
          _unit.plural === plural ||
          _unit.aliases.includes(singular) ||
          _unit.aliases.includes(plural)
        );
      });
    };
  };

  useEffect(() => {
    // Update the ingredientsWithAvailabilities when the corresponding props update
    setIngredientsWithAvailabilities(_ingredientsWithAvailabilities);
  }, [_ingredientsWithAvailabilities]);

  const setMappedName = (ingredient: WeightedIngredient) => (mappedName: string) => {
    setMappedNames((mappedNames) => ({ ...mappedNames, [ingredient.id]: mappedName }));
  };

  const switchIsReplaced = switchIsValue(isReplacementDisabledIds, setIsReplacementDisabledIds);
  const switchIsDisabled = switchIsValue(isDisabledIds, setIsDisabledIds);

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      // Ingredients with availabilities is an array of tuples with the first element of the tuple being a weighted
      // ingredient and the second element being an array of ingredients (the available elements are elements that got
      // matched with the full-text search by postgresql).
      //
      // Type: (readonly [WeightedIngredient, Tables<'ingredients'>[]])[];

      // Filter out the ingredients that are disabled.
      const enabledIngredientsWithAvailabilities = ingredientsWithAvailabilities.filter(
        ([ingredient]) => !isDisabledIds.includes(ingredient.id),
      );

      // Get the list of ingredients to create (the ones that are enabled AND that are either not replaced or that
      // don't have any available ingredients).
      const ingredientsToCreate = enabledIngredientsWithAvailabilities
        .filter(
          ([ingredient, availableIngredients]) =>
            isReplacementDisabledIds.includes(ingredient.id) || !availableIngredients.length,
        )
        .map(([ingredient]) => ingredient);
      const ingredientsToCreateData = ingredientsToCreate.map(
        (ingredient) =>
          ({
            name: ingredient.id in mappedNames ? mappedNames[ingredient.id] : capitalizeSentence(ingredient.name),

            opened_shelf_life: ingredient.opened_shelf_life,
            shelf_life: ingredient.shelf_life,
          }) satisfies TablesInsert<'ingredients'>,
      );

      // Get the list of ingredients to reuse / are already created for previous recipes (all the ingredients that are
      // enabled which are not to be created)
      const ingredientsToReuse = enabledIngredientsWithAvailabilities
        .filter(([ingredient, availableIngredients]) => {
          return availableIngredients.length && !isReplacementDisabledIds.includes(ingredient.id);
        })
        .map(([_, availableIngredients]) => availableIngredients[0]);

      const { data: createdIngredients, error: error1 } = await supabase
        .from('ingredients')
        .insert(ingredientsToCreateData)
        .select();
      if (error1) throw error1;

      // Ingredients to join to the recipe (ingredients__recipes table).
      const ingredientsToJoin = [...createdIngredients, ...ingredientsToReuse];

      /**
       * Get the weighted ingredient from the list of ingredients with availabilities.
       * @param ingredient The ingredient to get the weighted ingredient from.
       */
      const getWeightedIngredient = (ingredient: Tables<'ingredients'>) => {
        // Retrieve the id of the original ingredient from the mapped names
        const originalIngredientId = Object.keys(mappedNames).find((id) => mappedNames[id] === ingredient.name);
        const oldName = ingredientsToCreate.find((ingredient) => ingredient.id === originalIngredientId)?.name;

        // ! Careful, the weight are retrieved by the name of the ingredients. That could cause bugs.
        const weightedIngredientsWithAvailabilities = ingredientsWithAvailabilities.find(
          ([{ name }]) =>
            capitalizeSentence(ingredient.name) === capitalizeSentence(name) || (oldName && oldName === name),
        );
        if (!weightedIngredientsWithAvailabilities) return;

        return weightedIngredientsWithAvailabilities[0];
      };

      // The units insert data. Looking for all the ingredients to join to the recipe and getting the units from them.
      const unitsInsertData = unique(
        filterNotNull(
          ingredientsToJoin.map((ingredient) => {
            const weightedIngredient = getWeightedIngredient(ingredient);
            if (!weightedIngredient || !weightedIngredient.unit) return;

            const unit = findMatchingUnitFromIngredient(units)(weightedIngredient);
            if (unit) return;

            return weightedIngredient.unit.singular;
          }),
        ),
      ).map(
        (value) =>
          ({
            singular: value,
            plural: value,
          }) satisfies TablesInsert<'units'>,
      );

      const { data: createdUnits, error: error2 } = await supabase.from('units').insert(unitsInsertData).select();
      if (error2) throw error2;

      const combinedUnits = [...units, ...createdUnits];

      // recipes__ingredients table insert data, combining the ingredients, the quantities and the units
      const recipesIngredients = filterNotNull(
        await Promise.all(
          ingredientsToJoin.map(async (ingredient) => {
            const weightedIngredient = getWeightedIngredient(ingredient);
            if (!weightedIngredient) return;

            const unit = findMatchingUnitFromIngredient(combinedUnits)(weightedIngredient);

            return {
              ingredient_id: ingredient.id,
              recipe_id: recipe.id,
              quantity: weightedIngredient.quantity,
              unit_id: unit?.id,
            } satisfies TablesInsert<'recipes__ingredients'>;
          }),
        ),
      );

      const { error: error3 } = await supabase.from('recipes__ingredients').insert(recipesIngredients);
      if (error3) throw error3;

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

              matchingUnit: findMatchingUnitFromIngredient(units)(ingredient),

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
