import { Tables } from '@/type/database-generated.types';
import { WeightedIngredient } from '@/type/database.types';

export const pluralizedUnit = (unit: Tables<'units'>, quantity: number) => {
  if (quantity === 1) return unit.singular;
  return unit.plural;
};

export const ingredientPluralizedUnit = (ingredient: WeightedIngredient, substitute = '-') => {
  return ingredient.unit && ingredient.quantity ? pluralizedUnit(ingredient.unit, ingredient.quantity) : substitute;
};
