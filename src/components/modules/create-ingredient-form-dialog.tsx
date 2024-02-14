'use client';

import React, { useState } from 'react';

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
  children?: React.ReactNode;
}

interface IFormProps {
  close: VoidFunction;
}

const CreateIngredientForm = ({ close }: IFormProps) => {
  const { toastError } = useToast();

  const router = useRouter();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitLoading(true);

      // TODO : Check if the ingredient has already been created (from the url)

      const { error } = await supabase
        .from('ingredients')
        .insert({ name: values.name, shelf_life: values.shelf_life, opened_shelf_life: values.opened_shelf_life });
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

const CreateIngredientFormDialog = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (_isOpen: boolean) => {
    setIsOpen(_isOpen);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Formulaire de création d&apos;ingrédient</AlertDialogTitle>
          {/*<AlertDialogDescription> </AlertDialogDescription>*/}
        </AlertDialogHeader>

        <CreateIngredientForm close={() => setIsOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateIngredientFormDialog;
