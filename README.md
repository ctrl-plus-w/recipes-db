# Recipes DB

## Introduction

Recipes DB is a back-office part of a bigger project. The objective of this back-office is to handle the data related to 
the recipes (recipes, ingredients, units and products). From the interface, you can create, update, delete and list the 
recipes, ingredients, units and products.

## Technical Stack

The project is based on [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/). 
[Docker](https://www.docker.com/) is also used. 


## Installation

### Prerequisites

Regardless of the method of installation, you need to have the following `.env` file configured. First, copy the
`.env.example` file to `.env` and fill in the values.

- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Supabase anon key.

Both of the keys can either be retrieved on the supabase dashboard (the dashboard can be accessible locally by running 
the `supabase start` command in the directory or by accessing the [Supabase website](https://supabase.com/)).

### Docker Image
The first way to run the project is to use the Docker image. You can build the image with the following command:

```bash
docker build -t recipes-db .
```

Then, you can run the image with the following command:

```bash
docker run -p 3000:3000 recipes-db 
```

### Local Installation

The other way to run the project is to install it locally. First, you need to install the dependencies with the 
following command : `npm install`. Then, you can run the project with the following commands :

- `npm run dev` : Run the project in development mode.

- `npm run build` : Build the project.
- `npm run start` : Run the project in production mode.


## Test Recipes

- https://www.marmiton.org/recettes/recette_lasagnes-a-la-bolognaise_18215.aspx
- https://www.marmiton.org/recettes/recette_pates-a-la-bolognaise-facile_20482.aspx
