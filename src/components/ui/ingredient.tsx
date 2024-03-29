'use client';

import React, { ChangeEventHandler, Dispatch, SetStateAction, useMemo } from 'react';

import { RefreshCcwIcon } from 'lucide-react';

import SearchIngredientDialog from '@/feature/ingredients/search-ingredient-dialog';

import { Checkbox } from '@/ui/checkbox';
import InvisibleInput from '@/ui/invisible-input';

import { capitalizeSentence } from '@/util/string.util';
import { cn } from '@/util/style.util';
import { ingredientPluralizedUnit, pluralizedUnit } from '@/util/tables.util';

import { Tables, WeightedIngredient } from '@/type/database.types';

interface IProps {
  ingredient: WeightedIngredient;
  availableIngredients: Tables<'ingredients'>[];
  setIngredientsWithAvailabilities: Dispatch<
    SetStateAction<(readonly [WeightedIngredient, Tables<'ingredients'>[]])[]>
  >;

  matchingUnit?: Tables<'units'>;

  mappedName: string | undefined;
  setMappedName: (value: string) => void;

  switchIsDisabled: VoidFunction;
  isDisabled: boolean;

  switchIsReplacedDisabled: VoidFunction;
  isReplacedDisabled: boolean;
}

const Ingredient = ({
  ingredient,
  availableIngredients,
  setIngredientsWithAvailabilities,
  matchingUnit,
  switchIsReplacedDisabled,
  isReplacedDisabled,
  switchIsDisabled,
  isDisabled,
  setMappedName,
  mappedName,
}: IProps) => {
  const prettifiedName = useMemo(() => capitalizeSentence(ingredient.name), [ingredient]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setMappedName(event.target.value);
  };

  const onReplaceIngredient = (ingredientToAddAsAvailable: Tables<'ingredients'>) => {
    setIngredientsWithAvailabilities((ingredientsWithAvailabilities) => {
      const index = ingredientsWithAvailabilities.findIndex(([_ingredient]) => _ingredient.id === ingredient.id);

      const newIngredientsWithAvailabilities = [...ingredientsWithAvailabilities];
      newIngredientsWithAvailabilities[index] = [ingredient, [ingredientToAddAsAvailable]];

      return newIngredientsWithAvailabilities;
    });
  };

  return (
    <div
      className={cn(
        'flex items-center justify-start py-1 gap-4',
        'hover:bg-neutral-900 transition-all duration-300 cursor-pointer',
        isDisabled && 'opacity-60',
      )}
      key={ingredient.id}
    >
      <SearchIngredientDialog onIngredientClick={onReplaceIngredient}>
        <button
          className={cn(
            'p-2 -ml-2 hover:text-neutral-300 transition-colors duration-300',
            isDisabled && 'pointer-events-none',
          )}
          type="button"
        >
          <RefreshCcwIcon />
        </button>
      </SearchIngredientDialog>

      <div className={cn('flex flex-col transition-colors duration-300', isDisabled && 'pointer-events-none')}>
        <div className="flex items-center">
          <p>
            <strong>({ingredient.name})</strong>
          </p>

          <InvisibleInput value={mappedName ?? prettifiedName} onChange={onChange} className="mx-0" />

          {availableIngredients.length ? (
            <button
              onClick={() => switchIsReplacedDisabled()}
              className={cn('text-neutral-200', isReplacedDisabled && 'line-through')}
              type="button"
            >
              -&gt; {availableIngredients[0].name}
            </button>
          ) : (
            <></>
          )}
        </div>

        <p className="text-white/70">
          {!ingredient.quantity || isNaN(ingredient.quantity) ? (
            '-'
          ) : (
            <>
              <span className={cn(matchingUnit && 'line-through')}>
                {ingredient.quantity} {ingredientPluralizedUnit(ingredient)}
              </span>
              {matchingUnit ? (
                <>
                  {' '}
                  -&gt;{' '}
                  <span>
                    {ingredient.quantity} {pluralizedUnit(matchingUnit, ingredient.quantity)}
                  </span>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </p>
      </div>

      <Checkbox
        className="ml-auto"
        checked={!isDisabled}
        onCheckedChange={() => switchIsDisabled()}
        id={ingredient.id}
      />
    </div>
  );
};

export default Ingredient;
