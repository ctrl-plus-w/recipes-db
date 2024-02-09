import CreateRecipeFormDialog from "@/module/CreateRecipeFormDialog";

import { Button } from "@/ui/button";

export default function Home() {
  return (
    <CreateRecipeFormDialog>
      <Button variant="outline">Créer une recette</Button>
    </CreateRecipeFormDialog>
  );
}
