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
import { Form, TextFormField } from '@/ui/form';
import { toast, useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { TablesInsert } from '@/type/database-generated.types';

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
  children?: React.ReactNode;
}

interface IFormProps {
  close: VoidFunction;
}

const CreateUnitForm = ({ close }: IFormProps) => {
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

      // TODO : Check if the unit has already been created

      const aliases = values.aliases_txt?.split(',').map((alias) => alias.trim()) ?? [];

      const insertData = {
        singular: values.singular,
        plural: values.plural,
        aliases,
      } satisfies TablesInsert<'units'>;

      const { error } = await supabase.from('units').insert(insertData);
      if (error) throw error;

      toast({
        title: "L'unité a été créé !",
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
        <TextFormField control={form.control} name="plural" label="Nom (au plurier)" placeholder="grammes" />
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

        <CreateUnitForm close={() => setIsOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateIngredientFormDialog;
