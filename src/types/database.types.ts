import { Database as DatabaseGenerated } from '@/type/database-generated.types';
import { Tables } from '@/type/database-generated.types';

export type { Json, Tables } from '@/type/database-generated.types';

export type Database = DatabaseGenerated;

export type WeightedIngredient = Tables<'ingredients'> & {
  quantity: number | null;
  quantity_unit: string | null;
};

export type RecipeWithWeightedIngredients = Tables<'recipes'> & {
  ingredients: WeightedIngredient[];
};
