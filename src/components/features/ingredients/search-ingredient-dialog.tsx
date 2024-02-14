import React, { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import { Input } from '@/ui/input';
import { useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { Tables } from '@/type/database-generated.types';

interface IProps {
  onIngredientClick: (ingredient: Tables<'ingredients'>) => void | Promise<void>;
  children?: React.ReactNode;
}

const SearchIngredientDialog = ({ onIngredientClick, children }: IProps) => {
  const { toastError } = useToast();

  const [query, setQuery] = useState('');

  const [ingredients, setIngredients] = useState<Tables<'ingredients'>[]>([]);

  useEffect(() => {
    if (query === '') return setIngredients([]);

    const debounce = setTimeout(async () => {
      const { data: data1, error: error1 } = await supabase
        .from('ingredients')
        .select('*')
        .textSearch('name', query, { type: 'phrase' });
      if (error1) return toastError(error1);

      const { data: data2, error: error2 } = await supabase.from('ingredients').select('*').ilike('name', `%${query}%`);
      if (error2) return toastError(error2);

      const combinedData = [...(data1 || []), ...(data2 || [])];
      const data = combinedData.filter(
        (ingredient, i) => combinedData.findIndex((_ingredient) => _ingredient.id === ingredient.id) === i,
      );

      setIngredients(data);
    }, 100);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Recherche d&apos;un ingrédient</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom de l'ingrédient" />
        </div>

        <div className="flex flex-col gap-1 overflow-scroll h-full">
          {ingredients.map((ingredient) => (
            <AlertDialogAction key={ingredient.id} variant="ghost" onClick={() => onIngredientClick(ingredient)}>
              {ingredient.name}
            </AlertDialogAction>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Quitter</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SearchIngredientDialog;
