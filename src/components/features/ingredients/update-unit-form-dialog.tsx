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
import { Form, TextFormField } from '@/ui/form';
import { toast, useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { Tables, TablesUpdate } from '@/type/database-generated.types';

const formSchema = z.object({
  singular: z.string().min(2).max(50),
  plural: z.string().min(2).max(50),
  aliases_txt: z.string().optional(),
});

const defaultValues = {
  singular: '',
  plural: '',
  aliases_txt: '',
};

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  unit?: Tables<'units'>;
  children?: React.ReactNode;
}

interface IFormProps {
  unit: Tables<'units'>;
  close: VoidFunction;
}

const UpdateUnitForm = ({ unit, close }: IFormProps) => {
  const { toastError } = useToast();

  const router = useRouter();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    form.setValue('singular', unit.singular);
    form.setValue('plural', unit.plural);
    form.setValue('aliases_txt', unit.aliases.join(', '));
  }, [unit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitLoading(true);

      const aliases = values.aliases_txt?.split(',').map((alias) => alias.trim()) ?? [];

      const updateData = {
        singular: values.singular,
        plural: values.plural,
        aliases,
      } satisfies TablesUpdate<'units'>;

      const { error } = await supabase.from('units').update(updateData).eq('id', unit.id);

      if (error) throw error;

      toast({
        title: "L'unité a été modifiée !",
        description: (
          <p>
            <strong>{values.singular}</strong>
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
        <TextFormField control={form.control} name="singular" label="Nom (au singulier)" placeholder="gramme" />
        <TextFormField control={form.control} name="plural" label="Nom (au pluriel)" placeholder="grammes" />
        <TextFormField control={form.control} name="aliases_txt" label="Alias" placeholder="g, kg, mg" />

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

const UpdateUnitFormDialog = ({ isOpen, setIsOpen, unit, children }: IProps) => {
  const onOpenChange = (_isOpen: boolean) => {
    setIsOpen(_isOpen);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Formulaire de modification d&apos;une unité</AlertDialogTitle>
          {/*<AlertDialogDescription> </AlertDialogDescription>*/}
        </AlertDialogHeader>

        {unit && <UpdateUnitForm close={() => setIsOpen(false)} unit={unit} />}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateUnitFormDialog;
