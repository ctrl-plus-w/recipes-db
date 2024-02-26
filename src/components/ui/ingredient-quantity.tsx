import React from 'react';

import { cn } from '@/util/style.util';
import { ingredientPluralizedUnit } from '@/util/tables.util';

import { WeightedIngredient } from '@/type/database.types';

interface IProps {
  ingredient: WeightedIngredient;
  substitute?: string;

  className?: string;
}

const IngredientQuantity = ({ ingredient, className, substitute = '' }: IProps) => {
  return (
    <p className={cn(className)}>
      {!ingredient.quantity || isNaN(ingredient.quantity)
        ? substitute
        : `${ingredient.quantity} ${ingredientPluralizedUnit(ingredient, substitute)}`}
    </p>
  );
};

export default IngredientQuantity;
