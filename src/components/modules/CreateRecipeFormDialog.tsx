"use client";

import z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { HardDriveDownloadIcon, Loader2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  NumberFormField,
  TextFormField,
} from "@/ui/form";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { useToast } from "@/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  url: z.string().url(),
  servings: z.number().min(1),
  steps: z.string(),
  preparationTime: z.number().int(),
  waitingTime: z.number().int(),
  cookingTime: z.number().int(),
});

const defaultValues = {
  title: "",
  url: "",
  servings: 0,
  steps: "",
  preparationTime: 0,
  waitingTime: 0,
  cookingTime: 0,
};

interface IProps {
  children?: React.ReactNode;
}

interface IFormProps {
  close: VoidFunction;
}

const CreateRecipeForm = ({ close }: IFormProps) => {
  const { toastError } = useToast();
  const [isLoadingRecipeFromURL, setIsLoadingRecipeFromURL] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  const loadRecipeFromURL = async () => {
    try {
      setIsLoadingRecipeFromURL(true);

      const { url } = form.getValues();

      const res = await axios.get("/api/marmiton/recipe-from-url", {
        params: { url },
      });

      form.setValue("title", res.data.title);
      form.setValue("servings", res.data.servings);
      form.setValue("preparationTime", res.data.preparationTime);
      form.setValue("waitingTime", res.data.waitingTime);
      form.setValue("cookingTime", res.data.cookingTime);
      form.setValue("steps", res.data.steps.join("\n"));
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoadingRecipeFromURL(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextFormField
          control={form.control}
          name="title"
          label="Titre de la recette"
          placeholder="Boeuf bourgignon"
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>URL Marmiton</FormLabel>
              <div className="flex w-full space-x-4">
                <FormControl>
                  <Input
                    placeholder="https://www.marmiton.org/recettes/recette_boeuf-bourguignon_18889.aspx"
                    {...field}
                  />
                </FormControl>
                <Button
                  disabled={!fieldState.isDirty || field.disabled}
                  onClick={loadRecipeFromURL}
                  type="button"
                >
                  {isLoadingRecipeFromURL ? (
                    <Loader2Icon
                      width={18}
                      height={18}
                      className="animate-spin"
                    />
                  ) : (
                    <HardDriveDownloadIcon width={18} height={18} />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <NumberFormField
            label="Portions"
            placeholder={1}
            min={1}
            name="servings"
          />
          <NumberFormField
            label="Temps de préparation"
            placeholder={0}
            name="preparationTime"
          />
        </div>

        <div className="flex items-center space-x-4">
          <NumberFormField
            label="Temps d'attente"
            placeholder={0}
            name="waitingTime"
          />
          <NumberFormField
            label="Temps de cuisson"
            placeholder={0}
            name="cookingTime"
          />
        </div>

        <FormField
          control={form.control}
          name="steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Étapes</FormLabel>
              <FormControl>
                <Textarea placeholder="Découpez en morceaux..." {...field} />
              </FormControl>
              <FormDescription>
                Pour chaque étape, faites un retour à la ligne.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" type="button" onClick={close}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || !form.formState.isValid}
          >
            Valider
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CreateRecipeFormDialog = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (_isOpen: boolean) => {
    setIsOpen(_isOpen);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Formulaire de création de recette</AlertDialogTitle>
          <AlertDialogDescription>
            Vous pouvez automatiser le remplissage des champs à partir de l'URL
            en cliquant sur le bouton à droite du champ de celui-ci.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <CreateRecipeForm close={() => setIsOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateRecipeFormDialog;
