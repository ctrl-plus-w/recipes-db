import { QueryData } from '@supabase/supabase-js';
import axios from 'axios';
import { parse } from 'node-html-parser';

import supabase from '@/instance/database';

import { filterNotNull } from '@/util/array.util';

import { Tables } from '@/type/database-generated.types';

type RecipeCore = { title: string; url: string };

const recipeWithIngredients = supabase.from('recipe').select('*, ingredient(*)').limit(1).single();

export type RecipeWithIngredients = QueryData<typeof recipeWithIngredients>;

class Api {
  constructor() {}

  /**
   * Retrieve a list of recipes
   * @param page The page number (pagination)
   */
  static async getMainCourses(page = 1): Promise<RecipeCore[]> {
    const url = `https://www.marmiton.org/recettes/index/categorie/plat-principal/${page}`;
    const res = await axios.get(url);

    const doc = parse(res.data);

    const cardsElements = doc.querySelectorAll('.recipe-card');

    return filterNotNull(
      cardsElements.map((cardElement) => {
        const titleElement = cardElement.querySelector('h4.recipe-card__title');
        const anchorElement = cardElement.querySelector('a.recipe-card-link');

        if (!titleElement || !anchorElement) return;

        return {
          title: titleElement.text.trim(),
          url: anchorElement.attributes['href'],
        } satisfies RecipeCore;
      }),
    );
  }

  /**
   * Given a recipe, retrieve the detailed content of it (ingredients, steps, servings...)
   * @param url The marmiton recipe URL
   */
  static async getDetailedRecipe(url: string): Promise<RecipeWithIngredients> {
    const res = await axios.get(url);

    const doc = parse(res.data);

    // TODO: Add the images on the DetailedRecipe instance.
    // TODO: Add the preparation, waiting and cooking times.

    const titleElement = doc.querySelector('h1');
    const title = titleElement?.text.trim();

    // Retrieve the ingredients from the elements
    const ingredientsElements = doc.querySelectorAll('.mrtn-recette_ingredients-items .card-ingredient');
    const ingredients = filterNotNull(
      ingredientsElements.map((ingredientElement) => {
        const nameElement = ingredientElement.querySelector('.ingredient-name');
        // const quantityCountElement = ingredientElement.querySelector('.card-ingredient-quantity span.count');
        // const quantityUnitElement = ingredientElement.querySelector('.card-ingredient-quantity span.unit');

        if (!nameElement) return;

        // const count = quantityCountElement ? parseInt(quantityCountElement.text) : undefined;
        // const unit = quantityUnitElement?.text.trim() ?? null;

        return {
          id: '',
          name: nameElement.text.trim(),
          image: null,
          shelf_life: null,
          opened_shelf_life: null,
          created_at: new Date().toISOString(),
        } satisfies Tables<'ingredients'>;
      }),
    );

    // Retrieve the servings count from the element
    const servingsInputElement = doc.querySelector('.mrtn-recette_ingredients-counter');
    const servings =
      servingsInputElement && 'data-servingsnb' in servingsInputElement.attrs
        ? parseInt(servingsInputElement.attrs['data-servingsnb'])
        : NaN;

    // Retrieve the list of the steps from the elements
    const stepsElements = doc.querySelectorAll('.recipe-step-list .recipe-step-list__container > p');
    const steps = stepsElements.map((stepElement) => stepElement.text.trim());

    // Default values, yet to do
    const images: string[] = [];
    const preparationTime = 0;
    const waitingTime = 0;
    const cookingTime = 0;

    return {
      id: '',
      title,
      url,
      ingredients,
      servings,
      steps,
      images,
      preparationTime,
      waitingTime,
      cookingTime,
    } satisfies RecipeWithIngredients;
  }
}

export default Api;
