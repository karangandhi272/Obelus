import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { TableData } from "./openaiService";

// Map category strings to enum values for expenses
const mapToExpenseCategory = (
  category: string
): Database["public"]["Enums"]["expense_category"] => {
  const mapping: Record<
    string,
    Database["public"]["Enums"]["expense_category"]
  > = {
    housing: "Housing",
    rent: "Housing",
    mortgage: "Housing",
    transportation: "Transportation",
    car: "Transportation",
    gas: "Transportation",
    food: "Food",
    groceries: "Food",
    restaurant: "Food",
    healthcare: "Healthcare",
    medical: "Healthcare",
    doctor: "Healthcare",
    debt: "Debt Payments",
    loan: "Debt Payments",
    "credit card": "Debt Payments",
    savings: "Savings",
    investment: "Savings",
    entertainment: "Entertainment",
    movies: "Entertainment",
    games: "Entertainment",
    clothing: "Clothing",
    clothes: "Clothing",
    education: "Education",
    school: "Education",
    books: "Education",
  };

  // Try to find a match in the mapping
  const lowerCategory = category.toLowerCase();
  for (const key in mapping) {
    if (lowerCategory.includes(key)) {
      return mapping[key];
    }
  }

  // Default to Miscellaneous if no match
  return "Miscellaneous";
};

// Map payment method strings to enum values
const mapToPaymentMethod = (
  method: string
): Database["public"]["Enums"]["payment_method_enum"] => {
  if (method.toLowerCase().includes("credit")) {
    return "Credit";
  }
  return "Debit"; // Default to Debit if not specified or not credit
};

export async function saveTransactionData(
  tableData: TableData[],
  userId?: string
): Promise<void> {
  try {
    // Get the current authenticated user if userId is not provided
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
    }

    if (!userId) {
      throw new Error("User ID is required to save transaction data");
    }

    for (const table of tableData) {
      const { name, data } = table;

      // Format data according to table schema
      let formattedData = { ...data };

      switch (name) {
        case "expenses":
          formattedData = {
            ...data,
            category: mapToExpenseCategory(data.category),
            payment_method: mapToPaymentMethod(data.payment_method),
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId, // Use the authenticated user's ID
          };
          break;

        case "liabilities":
          formattedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId,
          };
          break;

        case "income":
          formattedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId,
          };
          break;

        case "savings":
          formattedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId,
          };
          break;

        case "savings_stock":
          formattedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId,
          };
          break;

        case "long_term_assets":
          formattedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            user_id: userId,
          };
          break;
      }

      // Insert data into appropriate table
      const { error, data: insertedData } = await supabase
        .from(name)
        .insert(formattedData)
        .select();

      if (error) {
        throw new Error(`Error inserting into ${name}: ${error.message}`);
      }

      // After inserting data, we need to update the corresponding User table JSON field
      await updateUserJsonData(name, userId);
    }
  } catch (error) {
    console.error("Error saving transaction data:", error);
    throw error;
  }
}

// Function to update User table JSON fields based on table updates
async function updateUserJsonData(
  tableName: string,
  userId: string
): Promise<void> {
  try {
    // Get the user record based on the auth ID
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("id")
      .eq("userid", userId)
      .single();

    if (userError) {
      throw new Error(`Error finding user: ${userError.message}`);
    }

    const numericUserId = userData.id;
    const currentDate = new Date().toISOString();

    // Update the appropriate JSON field based on the table name
    switch (tableName) {
      case "liabilities":
        await updateLiabilitiesJson(numericUserId, currentDate);
        break;
      case "expenses":
        await updateExpensesJson(numericUserId, currentDate);
        break;
      case "savings":
      case "savings_stock":
      case "long_term_assets":
        await updateAssetsJson(numericUserId, currentDate);
        break;
      case "income":
        await updateIncomeJson(numericUserId, currentDate);
        break;
    }
  } catch (error) {
    console.error(`Error updating user JSON data for ${tableName}:`, error);
    throw error;
  }
}

// Update the Liabilities JSON field
async function updateLiabilitiesJson(
  userId: number,
  date: string
): Promise<void> {
  // Calculate total liabilities
  const { data: liabilities, error } = await supabase
    .from("liabilities")
    .select("amount, category")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error fetching liabilities: ${error.message}`);
  }

  // Calculate total liabilities
  const total = liabilities.reduce((sum, item) => sum + item.amount, 0);

  // Create a JSON entry with date and total
  const liabilitiesEntry = {
    date,
    total,
    details: liabilities.map((item) => ({
      category: item.category,
      amount: item.amount,
    })),
  };

  // Update the User table
  const { error: updateError } = await supabase
    .from("Users")
    .update({ Liabilites: liabilitiesEntry })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Error updating liabilities JSON: ${updateError.message}`);
  }
}

// Update the Expenses JSON field
async function updateExpensesJson(userId: number, date: string): Promise<void> {
  // Calculate total expenses
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("amount, category")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error fetching expenses: ${error.message}`);
  }

  // Calculate total expenses
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Group expenses by category
  const expensesByCategory = expenses.reduce(
    (acc: Record<string, number>, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.amount;
      return acc;
    },
    {}
  );

  // Create an expenses entry with date and total
  const expensesEntry = {
    date,
    total,
    byCategory: expensesByCategory,
  };

  // Create an expense breakdown entry
  const expenseBreak = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100,
    })
  );

  // Update the User table with both Expenses and ExpenseBreak
  const { error: updateError } = await supabase
    .from("Users")
    .update({
      Expenses: expensesEntry,
      ExpenseBreak: expenseBreak,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Error updating expenses JSON: ${updateError.message}`);
  }
}

// Update the Assets JSON field
async function updateAssetsJson(userId: number, date: string): Promise<void> {
  // Get long-term assets
  const { data: longTermAssets, error: longTermError } = await supabase
    .from("long_term_assets")
    .select("amount, description")
    .eq("user_id", userId);

  if (longTermError) {
    throw new Error(
      `Error fetching long term assets: ${longTermError.message}`
    );
  }

  // Get savings
  const { data: savings, error: savingsError } = await supabase
    .from("savings")
    .select("current_amount, goal")
    .eq("user_id", userId);

  if (savingsError) {
    throw new Error(`Error fetching savings: ${savingsError.message}`);
  }

  // Get stocks
  const { data: stocks, error: stocksError } = await supabase
    .from("savings_stock")
    .select("current_value, stock_symbol")
    .eq("user_id", userId);

  if (stocksError) {
    throw new Error(`Error fetching stocks: ${stocksError.message}`);
  }

  // Calculate total assets
  const longTermTotal = longTermAssets.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const savingsTotal = savings.reduce(
    (sum, item) => sum + item.current_amount,
    0
  );
  const stocksTotal = stocks.reduce((sum, item) => sum + item.current_value, 0);
  const total = longTermTotal + savingsTotal + stocksTotal;

  // Create an assets entry
  const assetsEntry = {
    date,
    total,
    longTerm: {
      total: longTermTotal,
      items: longTermAssets,
    },
    savings: {
      total: savingsTotal,
      items: savings,
    },
    stocks: {
      total: stocksTotal,
      items: stocks,
    },
  };

  // Update the User table
  const { error: updateError } = await supabase
    .from("Users")
    .update({ Assets: assetsEntry })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Error updating assets JSON: ${updateError.message}`);
  }
}

// Update the Income JSON field
async function updateIncomeJson(userId: number, date: string): Promise<void> {
  // Get income data
  const { data: income, error } = await supabase
    .from("income")
    .select("amount, source")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error fetching income: ${error.message}`);
  }

  // Calculate total income
  const total = income.reduce((sum, item) => sum + item.amount, 0);

  // Create an income entry
  const incomeEntry = {
    date,
    total,
    sources: income.map((item) => ({
      source: item.source,
      amount: item.amount,
    })),
  };

  // Update the User table
  const { error: updateError } = await supabase
    .from("Users")
    .update({ Income: incomeEntry })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Error updating income JSON: ${updateError.message}`);
  }
}
