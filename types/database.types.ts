export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number;
          category: Database["public"]["Enums"]["expense_category"];
          id: number;
          payment_method: Database["public"]["Enums"]["payment_method_enum"];
          recurring: boolean | null;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          amount: number;
          category: Database["public"]["Enums"]["expense_category"];
          id?: number;
          payment_method: Database["public"]["Enums"]["payment_method_enum"];
          recurring?: boolean | null;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          amount?: number;
          category?: Database["public"]["Enums"]["expense_category"];
          id?: number;
          payment_method?: Database["public"]["Enums"]["payment_method_enum"];
          recurring?: boolean | null;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_expenses_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      income: {
        Row: {
          amount: number;
          id: number;
          source: string;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          amount: number;
          id?: number;
          source: string;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          amount?: number;
          id?: number;
          source?: string;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_income_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      liabilities: {
        Row: {
          amount: number;
          due_date: string | null;
          id: number;
          interest_rate: number;
          interest_type: string | null;
          minimum_payment: number;
          outstanding_balance: number;
          payment_frequency: string | null;
          recurring: boolean | null;
          start_date: string;
          status: string | null;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          amount: number;
          due_date?: string | null;
          id?: number;
          interest_rate: number;
          interest_type?: string | null;
          minimum_payment: number;
          outstanding_balance: number;
          payment_frequency?: string | null;
          recurring?: boolean | null;
          start_date: string;
          status?: string | null;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          amount?: number;
          due_date?: string | null;
          id?: number;
          interest_rate?: number;
          interest_type?: string | null;
          minimum_payment?: number;
          outstanding_balance?: number;
          payment_frequency?: string | null;
          recurring?: boolean | null;
          start_date?: string;
          status?: string | null;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_liabilities_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      long_term_assets: {
        Row: {
          amount: number;
          description: string | null;
          id: number;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          amount: number;
          description?: string | null;
          id?: number;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          amount?: number;
          description?: string | null;
          id?: number;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_long_term_assets_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      savings: {
        Row: {
          current_amount: number;
          goal: string;
          id: number;
          recurring: boolean | null;
          target_amount: number;
          target_date: string | null;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          current_amount: number;
          goal: string;
          id?: number;
          recurring?: boolean | null;
          target_amount: number;
          target_date?: string | null;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          current_amount?: number;
          goal?: string;
          id?: number;
          recurring?: boolean | null;
          target_amount?: number;
          target_date?: string | null;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_savings_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      savings_stock: {
        Row: {
          amount_invested: number;
          current_value: number;
          id: number;
          recurring: boolean | null;
          stock_symbol: string;
          timestamp: string | null;
          user_id: number;
        };
        Insert: {
          amount_invested: number;
          current_value: number;
          id?: number;
          recurring?: boolean | null;
          stock_symbol: string;
          timestamp?: string | null;
          user_id: number;
        };
        Update: {
          amount_invested?: number;
          current_value?: number;
          id?: number;
          recurring?: boolean | null;
          stock_symbol?: string;
          timestamp?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_savings_stock_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Users: {
        Row: {
          Assets: Json | null;
          created_at: string;
          ExpenseBreak: Json | null;
          Expenses: Json | null;
          id: number;
          Income: Json | null;
          Liabilites: Json | null;
          TrueWage: number | null;
          userid: string | null;
        };
        Insert: {
          Assets?: Json | null;
          created_at?: string;
          ExpenseBreak?: Json | null;
          Expenses?: Json | null;
          id?: number;
          Income?: Json | null;
          Liabilites?: Json | null;
          TrueWage?: number | null;
          userid?: string | null;
        };
        Update: {
          Assets?: Json | null;
          created_at?: string;
          ExpenseBreak?: Json | null;
          Expenses?: Json | null;
          id?: number;
          Income?: Json | null;
          Liabilites?: Json | null;
          TrueWage?: number | null;
          userid?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      expense_category:
        | "Housing"
        | "Transportation"
        | "Food"
        | "Healthcare"
        | "Debt Payments"
        | "Savings"
        | "Entertainment"
        | "Clothing"
        | "Education"
        | "Miscellaneous";
      payment_method_enum: "Credit" | "Debit";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
