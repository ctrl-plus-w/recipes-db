export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      ingredients: {
        Row: {
          created_at: string;
          id: string;
          image: string | null;
          name: string;
          opened_shelf_life: number | null;
          shelf_life: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image?: string | null;
          name: string;
          opened_shelf_life?: number | null;
          shelf_life?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image?: string | null;
          name?: string;
          opened_shelf_life?: number | null;
          shelf_life?: number | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          cookingTime: number | null;
          created_at: string;
          id: string;
          image: string | null;
          preparationTime: number | null;
          servings: number;
          steps: Json[];
          title: string;
          url: string;
          waitingTime: number | null;
        };
        Insert: {
          cookingTime?: number | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          preparationTime?: number | null;
          servings: number;
          steps: Json[];
          title: string;
          url: string;
          waitingTime?: number | null;
        };
        Update: {
          cookingTime?: number | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          preparationTime?: number | null;
          servings?: number;
          steps?: Json[];
          title?: string;
          url?: string;
          waitingTime?: number | null;
        };
        Relationships: [];
      };
      recipes__ingredients: {
        Row: {
          created_at: string;
          ingredient_id: string;
          quantity: number | null;
          quantity_unit: string | null;
          recipe_id: string;
        };
        Insert: {
          created_at?: string;
          ingredient_id: string;
          quantity?: number | null;
          quantity_unit?: string | null;
          recipe_id: string;
        };
        Update: {
          created_at?: string;
          ingredient_id?: string;
          quantity?: number | null;
          quantity_unit?: string | null;
          recipe_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recipes__ingredients_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recipes__ingredients_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
    ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
