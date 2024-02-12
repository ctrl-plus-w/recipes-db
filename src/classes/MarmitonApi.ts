import axios from 'axios';
import { parse } from 'node-html-parser';

import { filterNotNull } from '@/util/array.util';

import { RecipeWithWeightedIngredients, WeightedIngredient } from '@/type/database.types';

type RecipeCore = { title: string; url: string };

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
  static async getDetailedRecipe(url: string): Promise<RecipeWithWeightedIngredients> {
    const res = await axios.get(url);

    const doc = parse(res.data);

    // TODO: Add the images on the DetailedRecipe instance.
    // TODO: Add the preparation, waiting and cooking times.

    const titleElement = doc.querySelector('h1');
    const title = titleElement?.text.trim() ?? 'Unknown';

    // Retrieve the ingredients from the elements
    const ingredientsElements = doc.querySelectorAll('.mrtn-recette_ingredients-items .card-ingredient');
    const ingredients = filterNotNull(
      ingredientsElements.map((ingredientElement, index) => {
        const nameElement = ingredientElement.querySelector('.ingredient-name');
        const quantityCountElement = ingredientElement.querySelector('.card-ingredient-quantity span.count');
        const quantityUnitElement = ingredientElement.querySelector('.card-ingredient-quantity span.unit');

        if (!nameElement) return;

        const count = quantityCountElement ? parseInt(quantityCountElement.text) : null;
        const unit = quantityUnitElement?.text.trim() ?? null;

        return {
          id: `ingredient-${index}`,
          name: nameElement.text.trim(),
          image: null,
          quantity: count,
          quantity_unit: unit,
          shelf_life: null,
          opened_shelf_life: null,
          ts: null,
          created_at: new Date().toISOString(),
        } satisfies WeightedIngredient;
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
    const preparationTime = 0;
    const waitingTime = 0;
    const cookingTime = 0;

    return {
      id: '',
      title,
      url,
      servings,
      steps,
      ingredients,
      image: null,
      preparationTime,
      waitingTime,
      cookingTime,
      created_at: new Date().toISOString(),
    } satisfies RecipeWithWeightedIngredients;
  }
}

export default Api;
