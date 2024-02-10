'use client';

import React, { useState } from 'react';

import { revalidatePath } from 'next/cache';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/ui/button';
import { Form, NumberFormField, TextFormField } from '@/ui/form';
import { useToast } from '@/ui/use-toast';

import { RessourceNotFoundError } from '@/class/ApiError';

import supabase from '@/instance/database';

import { Tables } from '@/type/database-generated.types';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  shelf_life: z.number().min(1),
  opened_shelf_life: z.number().optional(),
  quantity: z.number().optional(),
  quantity_unit: z.string().optional(),
});

const defaultValues = {
  name: '',
  shelf_life: 1,
  opened_shelf_life: -1,
  quantity: 0,
  quantity_unit: '',
};

interface IProps {
  recipe: Tables<'recipes'>;
}

const CreateIngredientForm = ({ recipe }: IProps) => {
  const { toast, toastError } = useToast();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  const onReset = () => {
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitLoading(true);

      const { error: error1, data: createdIngredient } = await supabase
        .from('ingredients')
        .insert({
          name: values.name,
          shelf_life: values.shelf_life,
          opened_shelf_life: values.opened_shelf_life,
        })
        .select()
        .single();

      if (!createdIngredient) throw new RessourceNotFoundError('Ingredient');
      if (error1) throw error1;

      const { error: error2 } = await supabase.from('recipes__ingredients').insert({
        ingredient_id: createdIngredient.id,
        recipe_id: recipe.id,
        quantity: values.quantity,
        quantity_unit: values.quantity_unit,
      });

      if (error2) throw error2;

      toast({
        title: "L'ingrédient à été créé et ajouté !",
        description: (
          <p>
            <strong>{values.name}</strong>,{' '}
            <strong>
              {values.quantity} {values.quantity_unit}
            </strong>
            .
          </p>
        ),
      });

      revalidatePath(`/recipes/${recipe.id}`);
      form.reset();
    } catch (err) {
      toastError(err);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <TextFormField
            className="w-full"
            control={form.control}
            name="name"
            label="Nom de l'ingrédient"
            placeholder="Pommes de terre"
          />
          <NumberFormField
            className="w-full"
            control={form.control}
            name="shelf_life"
            label="Durée de conservation"
            placeholder={0}
          />
          <NumberFormField
            className="w-full"
            control={form.control}
            name="opened_shelf_life"
            label="Durée de conservation (ouvert)"
            placeholder={0}
          />
        </div>

        <div className="flex gap-4">
          <NumberFormField className="w-full" label="Quantitée" placeholder={0} name="quantity" />
          <TextFormField className="w-full" label="Unitée" placeholder="g" name="quantity_unit" />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onReset}>
            Réinitialiser
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid || isSubmitLoading}>
            {isSubmitLoading ? 'Loading...' : "Créer l'ingrédient"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateIngredientForm;
