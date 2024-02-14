'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import { Button } from '@/ui/button';
import { Form, NumberFormField, TextFormField } from '@/ui/form';
import { toast, useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { Tables } from '@/type/database-generated.types';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  shelf_life: z.number().int().optional(),
  opened_shelf_life: z.number().int().optional(),
});

const defaultValues = {
  name: '',
  shelf_life: undefined,
  opened_shelf_life: undefined,
};

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  ingredient?: Tables<'ingredients'>;
  children?: React.ReactNode;
}

interface IFormProps {
  ingredient: Tables<'ingredients'>;
  close: VoidFunction;
}

const UpdateIngredientForm = ({ ingredient, close }: IFormProps) => {
  const { toastError } = useToast();

  const router = useRouter();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    form.setValue('name', ingredient.name);
    form.setValue('opened_shelf_life', ingredient.opened_shelf_life ?? undefined);
    form.setValue('shelf_life', ingredient.shelf_life ?? undefined);
  }, [ingredient]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitLoading(true);

      const { error } = await supabase
        .from('ingredients')
        .update({ name: values.name, shelf_life: values.shelf_life, opened_shelf_life: values.opened_shelf_life })
        .eq('id', ingredient.id);

      if (error) throw error;

      toast({
        title: "L'ingrédient a été créé !",
        description: (
          <p>
            <strong>{values.name}</strong>
          </p>
        ),
      });

      // Close the modal
      close();
      router.refresh();
    } catch (err) {
      toastError(err);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextFormField control={form.control} name="name" label="Nom de l'ingrédient" placeholder="Lardons" />

        <div className="flex items-center space-x-4">
          <NumberFormField label="Temps de conservation" placeholder={1} name="shelf_life" />
          <NumberFormField label="Temps de conservation (ouvert)" placeholder={0} name="opened_shelf_life" />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" type="button" onClick={close}>
            Annuler
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid || isSubmitLoading}>
            {isSubmitLoading ? 'Loading...' : 'Valider'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const UpdateIngredientFormDialog = ({ isOpen, setIsOpen, ingredient, children }: IProps) => {
  const onOpenChange = (_isOpen: boolean) => {
    setIsOpen(_isOpen);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Formulaire de modification d&apos;un ingrédient</AlertDialogTitle>
          {/*<AlertDialogDescription> </AlertDialogDescription>*/}
        </AlertDialogHeader>

        {ingredient && <UpdateIngredientForm close={() => setIsOpen(false)} ingredient={ingredient} />}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateIngredientFormDialog;
