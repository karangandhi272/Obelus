export interface TableData {
  name: string;
  data: Record<string, any>;
}

export interface TransactionResponse {
  tables: TableData[];
  assumptions: string[];
}

export async function processTransaction(
  input: string
): Promise<TransactionResponse> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `I need you to act as a transaction processor for my personal finance database. I'll provide you with simple transaction descriptions, and I want you to:

                        1. Analyze the transaction to determine which table(s) in my database should be updated (options: expenses, liabilities, users, savings, savings_stock, long_term_assets)

                        2. For each relevant table, specify exactly what data should be inserted as a new row, with values for each required field based on the database schema shown in my previous message.

                        3. Format your response as a valid JSON object that I can parse programmatically.

                        My database has the following structure:
                        - expenses: id, user_id, amount, category, payment_method, timestamp, recurring
                        - liabilities: id, user_id, amount, interest_rate, minimum_payment, outstanding_balance, start_date, due_date, interest_type, payment_frequency, status, timestamp, recurring
                        - users: id, created_at, Expenses, Income, ExpenseBreak, Liabilities, TrueWage, Assets
                        - savings: id, user_id, goal, target_amount, current_amount, target_date, timestamp, recurring
                        - savings_stock: id, user_id, stock_symbol, amount_invested, current_value, timestamp, recurring
                        - long_term_assets: id, user_id, amount, description, timestamp
                        - income: id, user_id, amount, source, timestamp 

                        Transaction example: "Paid $45.99 for groceries using my credit card"

                    

                        {
                        "tables": [
                            {
                            "name": "expenses",
                            "data": {
                                "user_id": "[your_user_id]",
                                "amount": 45.99,
                                "category": "groceries",
                                "payment_method": "credit card",
                                "timestamp": "[current_timestamp]",
                                "recurring": false
                            }
                            }
                        ],
                        "assumptions": [
                            "Used current timestamp for the transaction",
                            "Assumed this is not a recurring expense"
                        ]
                        }

                        Your response should include:
                        1. Identification of relevant table(s)
                        2. Complete row data for insertion into each table
                        3. Any assumptions you made about missing information`,
          },
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Error processing transaction");
    }

    try {
      // Try to parse the response as JSON
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, provide a fallback response
      console.log(
        "Could not parse JSON response, using fallback:",
        data.choices[0].message.content
      );
      return {
        tables: [
          {
            name: "expenses",
            data: {
              user_id: 1,
              amount: 0,
              category: "Miscellaneous",
              payment_method: "Debit",
              timestamp: new Date().toISOString(),
              recurring: false,
            },
          },
        ],
        assumptions: [
          "Failed to parse transaction, using generic data",
          "Original input: " + input,
        ],
      };
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}
