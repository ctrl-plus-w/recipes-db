'use client';

import React, { ChangeEventHandler, useMemo } from 'react';

import { Checkbox } from '@/ui/checkbox';
import InvisibleInput from '@/ui/invisible-input';

import { capitalizeSentence } from '@/util/string.util';
import { cn } from '@/util/style.util';

import { Tables, WeightedIngredient } from '@/type/database.types';

interface IProps {
  ingredient: WeightedIngredient;
  availableIngredients: Tables<'ingredients'>[];

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

  return (
    <label
      className="flex items-center justify-between py-1 hover:bg-neutral-900 transition-all duration-300 cursor-pointer"
      key={ingredient.id}
      htmlFor={ingredient.id}
    >
      <div
        className={cn('flex flex-col transition-colors duration-300', isDisabled && 'opacity-60 pointer-events-none')}
      >
        <div className="flex items-center">
          <p>
            <strong>({ingredient.name})</strong>
          </p>

          <InvisibleInput value={mappedName ?? prettifiedName} onChange={onChange} className="mx-0" />

          {availableIngredients.length ? (
            <button
              onClick={() => switchIsReplacedDisabled()}
              className={cn('text-neutral-200', isReplacedDisabled && 'line-through')}
            >
              -&gt; {availableIngredients[0].name}
            </button>
          ) : (
            <></>
          )}
        </div>

        <p className="text-white/70">
          {!ingredient.quantity || isNaN(ingredient.quantity) ? '-' : ingredient.quantity}{' '}
          <span>{ingredient.quantity_unit}</span>
        </p>
      </div>

      <Checkbox checked={!isDisabled} onCheckedChange={() => switchIsDisabled()} id={ingredient.id} />
    </label>
  );
};

export default Ingredient;
