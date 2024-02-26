alter table "public"."recipes__ingredients" drop constraint "recipes__ingredients_ingredient_id_fkey";

alter table "public"."recipes__ingredients" drop constraint "recipes__ingredients_recipe_id_fkey";

create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "ingredient_id" uuid not null,
    "unit_id" uuid not null,
    "quantity" double precision not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."units" (
    "id" uuid not null default gen_random_uuid(),
    "singular" text not null,
    "plural" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."ingredients" drop column "image";

alter table "public"."ingredients" add column "image_url" text;

alter table "public"."recipes__ingredients" drop column "quantity_unit";

alter table "public"."recipes__ingredients" add column "unit_id" uuid;

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX units_pkey ON public.units USING btree (id);

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."units" add constraint "units_pkey" PRIMARY KEY using index "units_pkey";

alter table "public"."products" add constraint "products_ingredient_id_fkey" FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_ingredient_id_fkey";

alter table "public"."products" add constraint "products_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT not valid;

alter table "public"."products" validate constraint "products_unit_id_fkey";

alter table "public"."recipes__ingredients" add constraint "recipes__ingredients_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT not valid;

alter table "public"."recipes__ingredients" validate constraint "recipes__ingredients_unit_id_fkey";

alter table "public"."recipes__ingredients" add constraint "recipes__ingredients_ingredient_id_fkey" FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE not valid;

alter table "public"."recipes__ingredients" validate constraint "recipes__ingredients_ingredient_id_fkey";

alter table "public"."recipes__ingredients" add constraint "recipes__ingredients_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE not valid;

alter table "public"."recipes__ingredients" validate constraint "recipes__ingredients_recipe_id_fkey";


