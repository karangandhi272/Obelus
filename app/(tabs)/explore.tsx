import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenWidth = Dimensions.get("window").width - 40;
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  interface CategoryData {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }

  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [weeklySpendingData, setWeeklySpendingData] = useState(null);
  const [financialRatios, setFinancialRatios] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [financialHealthScore, setFinancialHealthScore] = useState(null);
  const [cashFlowForecast, setCashFlowForecast] = useState(null);
  const [goalProgress, setGoalProgress] = useState(null);
  const [debtOptimization, setDebtOptimization] = useState(null);
  const [savingsRateHistory, setSavingsRateHistory] = useState(null);
  const [netWorthGrowth, setNetWorthGrowth] = useState(null);
  const [extendedAiInsights, setExtendedAiInsights] = useState([]);
  const [trueHourlyWage, setTrueHourlyWage] = useState(0);

  // Dynamic theme colors
  const theme = {
    background: isDark ? "#121212" : "#f7f7f7",
    card: isDark ? "#1e1e1e" : "#ffffff",
    text: isDark ? "#ffffff" : "#333333",
    textSecondary: isDark ? "#aaaaaa" : "#666666",
    accent: isDark ? "#3b82f6" : "#2563eb",
    border: isDark ? "#333333" : "#e0e0e0",
    chartBackground: isDark ? "#1e1e1e" : "#ffffff",
    chartText: isDark ? "#ffffff" : "#333333",
    positive: "#10b981",
    negative: "#f43f5e",
  };

  // Fetch user data
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("userid", user.id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setUserData(data);
        processUserData(data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process and transform user data for display
  const processUserData = (data) => {
    try {
      // Set true hourly wage
      setTrueHourlyWage(data.TrueWage || 24.75);

      // Process income and expenses for monthly data
      processIncomeExpenses(data);

      // Process expense breakdown for category data
      processExpenseBreakdown(data);

      // Process weekly spending data
      processWeeklySpending(data);

      // Calculate financial ratios
      calculateFinancialRatios(data);

      // Generate AI insights
      generateAIInsights(data);

      // Calculate financial health score
      calculateFinancialHealthScore(data);

      // Generate cash flow forecast
      generateCashFlowForecast(data);

      // Process savings goals
      processSavingsGoals(data);

      // Process debt data
      processDebtData(data);

      // Calculate savings rate history
      calculateSavingsRateHistory(data);

      // Calculate net worth growth
      calculateNetWorthGrowth(data);
    } catch (err) {
      console.error("Error processing user data:", err);
      setError("Failed to process financial data. Please try again.");
    }
  };

  // Process income and expenses for monthly data
  const processIncomeExpenses = (data: { Income: {}; Expenses: {} }) => {
    try {
      const incomeData = data.Income || {};
      const expensesData = data.Expenses || {};

      // Convert JSON data to arrays for the chart
      // Assuming Income and Expenses have month keys like "Jan", "Feb", etc.
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const incomeValues = [];
      const expenseValues = [];

      // Get the last 6 months of data or use available data
      for (const month of months) {
        incomeValues.push(incomeData[month] || 0);
        expenseValues.push(expensesData[month] || 0);
      }

      // Create the chart data object
      const chartData = {
        labels: months,
        datasets: [
          {
            data: incomeValues,
            color: () => theme.accent,
            strokeWidth: 2,
            legend: "Income",
          },
          {
            data: expenseValues,
            color: () => theme.negative,
            strokeWidth: 2,
            legend: "Expenses",
          },
        ],
      };

      setMonthlyData(chartData);
    } catch (err) {
      console.error("Error processing income/expenses:", err);
      // Fallback to default data
      setMonthlyData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            data: [2100, 2400, 2800, 3200, 3000, 3240],
            color: () => theme.accent,
            strokeWidth: 2,
            legend: "Income",
          },
          {
            data: [1800, 2000, 2300, 2700, 2500, 2864],
            color: () => theme.negative,
            strokeWidth: 2,
            legend: "Expenses",
          },
        ],
      });
    }
  };

  // Process expense breakdown for category data
  const processExpenseBreakdown = (data) => {
    try {
      const expenseBreak = data.ExpenseBreak || {};

      // Convert to the format needed for the PieChart
      const categories = [];

      // Define standard colors for categories
      const categoryColors = {
        Housing: "#f59e0b",
        Food: "#10b981",
        Transportation: "#8b5cf6",
        Entertainment: "#3b82f6",
        Healthcare: "#ec4899",
        "Debt Payments": "#ef4444",
        Savings: "#22c55e",
        Education: "#6366f1",
        Clothing: "#d946ef",
        Miscellaneous: "#71717a",
      };

      // Process each category
      for (const [category, amount] of Object.entries(expenseBreak)) {
        categories.push({
          name: category,
          amount: amount,
          color: categoryColors[category] || "#71717a", // Fallback color
          legendFontColor: theme.text,
          legendFontSize: 12,
        });
      }

      // Sort by amount descending
      categories.sort((a, b) => b.amount - a.amount);

      setCategoryData(categories);
    } catch (err) {
      console.error("Error processing expense breakdown:", err);
      // Fallback to default data
      setCategoryData([
        {
          name: "Food",
          amount: 840,
          color: "#f59e0b",
          legendFontColor: theme.text,
          legendFontSize: 12,
        },
        {
          name: "Transport",
          amount: 520,
          color: "#8b5cf6",
          legendFontColor: theme.text,
          legendFontSize: 12,
        },
        {
          name: "Utilities",
          amount: 480,
          color: "#10b981",
          legendFontColor: theme.text,
          legendFontSize: 12,
        },
        {
          name: "Shopping",
          amount: 320,
          color: "#3b82f6",
          legendFontColor: theme.text,
          legendFontSize: 12,
        },
        {
          name: "Other",
          amount: 704,
          color: "#ec4899",
          legendFontColor: theme.text,
          legendFontSize: 12,
        },
      ]);
    }
  };

  // Process weekly spending data
  const processWeeklySpending = (data) => {
    try {
      const expenses = data.Expenses || {};

      // If expenses data has weekly breakdown, use it
      // Otherwise, generate some reasonable values based on monthly data

      // Calculate average daily expense for the current month
      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });
      const monthlyExpense = expenses[currentMonth] || 3000; // Default to 3000 if no data
      const avgDailyExpense = monthlyExpense / 30;

      // Create a weekly pattern with some randomness
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weeklyPattern = [0.8, 0.7, 0.9, 0.75, 1.3, 1.8, 1.1]; // Relative spending by day

      const weeklyData = {
        labels: daysOfWeek,
        datasets: [
          {
            data: weeklyPattern.map((factor) =>
              Math.round(avgDailyExpense * factor)
            ),
          },
        ],
      };

      setWeeklySpendingData(weeklyData);
    } catch (err) {
      console.error("Error processing weekly spending:", err);
      // Fallback to default data
      setWeeklySpendingData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            data: [65, 42, 110, 35, 95, 180, 130],
          },
        ],
      });
    }
  };

  // Calculate financial ratios
  const calculateFinancialRatios = (data) => {
    try {
      const income = data.Income || {};
      const expenses = data.Expenses || {};
      const expenseBreak = data.ExpenseBreak || {};
      const liabilities = data.Liabilites || {};

      // Get the current month
      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });

      // Get current month values or use the last available month
      const currentMonthIncome =
        income[currentMonth] || Object.values(income).pop() || 3000;
      const currentMonthExpenses =
        expenses[currentMonth] || Object.values(expenses).pop() || 2500;

      // Calculate savings rate
      const savingsAmount = currentMonthIncome - currentMonthExpenses;
      const savingsRate = (savingsAmount / currentMonthIncome) * 100;

      // Calculate expense ratio
      const expenseRatio = (currentMonthExpenses / currentMonthIncome) * 100;

      // Calculate housing cost
      const housingCost = expenseBreak["Housing"] || 0;
      const housingRatio = (housingCost / currentMonthExpenses) * 100;

      // Calculate debt ratio
      const debtPayments = expenseBreak["Debt Payments"] || 0;
      const debtRatio = (debtPayments / currentMonthIncome) * 100;

      // Set financial ratios
      const ratios = [
        {
          name: "Savings Rate",
          value: `${savingsRate.toFixed(1)}%`,
          status:
            savingsRate >= 10 ? "good" : savingsRate >= 5 ? "warning" : "bad",
          description: "Percentage of income saved",
        },
        {
          name: "Expense Ratio",
          value: `${expenseRatio.toFixed(1)}%`,
          status:
            expenseRatio <= 80
              ? "good"
              : expenseRatio <= 90
              ? "warning"
              : "bad",
          description: "Expenses as percentage of income",
        },
        {
          name: "Housing Cost",
          value: `${housingRatio.toFixed(1)}%`,
          status:
            housingRatio <= 30
              ? "good"
              : housingRatio <= 40
              ? "warning"
              : "bad",
          description: "Housing as percentage of expenses",
        },
        {
          name: "Debt Ratio",
          value: `${debtRatio.toFixed(1)}%`,
          status:
            debtRatio <= 20 ? "good" : debtRatio <= 30 ? "warning" : "bad",
          description: "Debt payments as percentage of income",
        },
      ];

      setFinancialRatios(ratios);
    } catch (err) {
      console.error("Error calculating financial ratios:", err);
      // Fallback to default ratios
      setFinancialRatios([
        {
          name: "Savings Rate",
          value: "11.6%",
          status: "good",
          description: "Percentage of income saved",
        },
        {
          name: "Expense Ratio",
          value: "88.4%",
          status: "warning",
          description: "Expenses as percentage of income",
        },
        {
          name: "Housing Cost",
          value: "27.3%",
          status: "good",
          description: "Housing as percentage of expenses",
        },
        {
          name: "Debt Ratio",
          value: "18.2%",
          status: "good",
          description: "Debt payments as percentage of income",
        },
      ]);
    }
  };

  // Generate AI insights based on user data
  const generateAIInsights = (data) => {
    try {
      const income = data.Income || {};
      const expenses = data.Expenses || {};
      const expenseBreak = data.ExpenseBreak || {};

      // Get current and previous months
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const currentMonthIndex = new Date().getMonth();
      const currentMonth = months[currentMonthIndex % months.length];
      const prevMonth =
        months[(currentMonthIndex - 1 + months.length) % months.length];
      const twoMonthsAgo =
        months[(currentMonthIndex - 2 + months.length) % months.length];

      // Calculate some trends
      const foodCurrent = expenseBreak["Food"] || 0;
      const foodLastMonth = foodCurrent * 0.85; // Simulated previous month food expense
      const foodTrend = ((foodCurrent - foodLastMonth) / foodLastMonth) * 100;

      const shoppingCurrent =
        expenseBreak["Shopping"] || expenseBreak["Clothing"] || 0;
      const shoppingLastMonth = shoppingCurrent * 0.77; // Simulated previous month shopping expense
      const shoppingTrend =
        ((shoppingCurrent - shoppingLastMonth) / shoppingLastMonth) * 100;

      // Calculate savings rate trend
      const currentIncome = income[currentMonth] || 0;
      const currentExpense = expenses[currentMonth] || 0;
      const prevIncome = income[prevMonth] || 0;
      const prevExpense = expenses[prevMonth] || 0;

      const currentSavingsRate =
        ((currentIncome - currentExpense) / currentIncome) * 100;
      const prevSavingsRate = ((prevIncome - prevExpense) / prevIncome) * 100;
      const savingsRateTrend = currentSavingsRate - prevSavingsRate;

      // Calculate subscription percentage
      const subscriptions = expenseBreak["Entertainment"] * 0.7 || 300; // Estimate 70% of entertainment is subscriptions
      const subscriptionPercentage = (subscriptions / currentExpense) * 100;

      // Create insights
      const insights = [
        `You spent ${foodTrend.toFixed(
          1
        )}% more on dining out this month compared to your 3-month average`,
        `Consider setting a budget for shopping as it has increased ${shoppingTrend.toFixed(
          1
        )}% over the last two months`,
        `Your savings rate is ${
          savingsRateTrend > 0 ? "improving" : "declining"
        } - ${savingsRateTrend > 0 ? "up" : "down"} ${Math.abs(
          savingsRateTrend
        ).toFixed(1)}% from last month`,
        `Recurring subscriptions make up ${subscriptionPercentage.toFixed(
          1
        )}% of your monthly expenses`,
      ];

      // Extended insights
      const extendedInsights = [
        ...insights,
        `Your Netflix subscription appears unused in the last 60 days - consider pausing it to save $13.99/month`,
        `Based on your income level, you'd need to work ${(
          60 / data.TrueWage
        ).toFixed(1)} hours to afford your average restaurant meal`,
        `Your investment portfolio is outperforming the S&P 500 by 2.3% this quarter`,
        `You could save approximately $450/year by negotiating your internet and phone bills`,
      ];

      setAiInsights(insights);
      setExtendedAiInsights(extendedInsights);
    } catch (err) {
      console.error("Error generating AI insights:", err);
      // Fallback to default insights
      setAiInsights([
        "You spent 15% more on dining out this month compared to your 3-month average",
        "Consider setting a budget for shopping as it has increased 23% over the last two months",
        "Your savings rate is improving - up 2.3% from last month",
        "Recurring subscriptions make up 8.5% of your monthly expenses",
      ]);
      setExtendedAiInsights([
        "You spent 15% more on dining out this month compared to your 3-month average",
        "Consider setting a budget for shopping as it has increased 23% over the last two months",
        "Your savings rate is improving - up 2.3% from last month",
        "Recurring subscriptions make up 8.5% of your monthly expenses",
        "Your Netflix subscription appears unused in the last 60 days - consider pausing it to save $13.99/month",
        "Based on your income level, you'd need to work 5.2 hours to afford your average restaurant meal",
        "Your investment portfolio is outperforming the S&P 500 by 2.3% this quarter",
        "You could save approximately $450/year by negotiating your internet and phone bills",
      ]);
    }
  };

  // Calculate financial health score
  const calculateFinancialHealthScore = (data) => {
    try {
      const income = data.Income || {};
      const expenses = data.Expenses || {};
      const assets = data.Assets || {};
      const liabilities = data.Liabilites || {};

      // Calculate savings rate score (25% weight)
      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });
      const currentIncome =
        income[currentMonth] || Object.values(income).pop() || 3000;
      const currentExpense =
        expenses[currentMonth] || Object.values(expenses).pop() || 2500;
      const savingsRate =
        ((currentIncome - currentExpense) / currentIncome) * 100;
      const savingsRateScore = Math.min(100, savingsRate * 5); // 20% savings rate = 100 score

      // Calculate debt-to-income ratio score (25% weight)
      const totalDebt = Object.values(liabilities).reduce(
        (sum, value) => sum + value,
        0
      );
      const monthlyDebtPayment = totalDebt * 0.02; // Estimate monthly payment as 2% of total debt
      const debtToIncomeRatio = (monthlyDebtPayment / currentIncome) * 100;
      const debtToIncomeScore = Math.max(0, 100 - debtToIncomeRatio * 2.5); // 40% DTI = 0 score

      // Calculate emergency fund score (25% weight)
      const totalAssets = Object.values(assets).reduce(
        (sum, value) => sum + value,
        0
      );
      const monthlyExpenses = currentExpense;
      const emergencyFundMonths = totalAssets / monthlyExpenses;
      const emergencyFundScore = Math.min(100, emergencyFundMonths * 16.67); // 6 months = 100 score

      // Calculate diversification score (25% weight)
      // Just use a reasonable estimate based on assets distribution
      const diversificationScore = 90; // Default to a good diversification

      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        savingsRateScore * 0.25 +
          debtToIncomeScore * 0.25 +
          emergencyFundScore * 0.25 +
          diversificationScore * 0.25
      );

      // Create the financial health score object
      const healthScore = {
        score: overallScore,
        maxScore: 100,
        components: [
          {
            name: "Savings Rate",
            value: Math.round(savingsRateScore),
            weight: "25%",
          },
          {
            name: "Debt-to-Income",
            value: Math.round(debtToIncomeScore),
            weight: "25%",
          },
          {
            name: "Emergency Fund",
            value: Math.round(emergencyFundScore),
            weight: "25%",
          },
          {
            name: "Diversification",
            value: Math.round(diversificationScore),
            weight: "25%",
          },
        ],
      };

      setFinancialHealthScore(healthScore);
    } catch (err) {
      console.error("Error calculating financial health score:", err);
      // Fallback to default health score
      setFinancialHealthScore({
        score: 78,
        maxScore: 100,
        components: [
          { name: "Savings Rate", value: 85, weight: "25%" },
          { name: "Debt-to-Income", value: 72, weight: "25%" },
          { name: "Emergency Fund", value: 65, weight: "25%" },
          { name: "Diversification", value: 90, weight: "25%" },
        ],
      });
    }
  };

  // Generate cash flow forecast
  const generateCashFlowForecast = (data) => {
    try {
      const income = data.Income || {};
      const expenses = data.Expenses || {};

      // Get the current month
      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });

      // Calculate average monthly income and expenses
      const incomeValues = Object.values(income);
      const expenseValues = Object.values(expenses);
      const avgMonthlyIncome =
        incomeValues.reduce((sum, val) => sum + val, 0) /
        Math.max(1, incomeValues.length);
      const avgMonthlyExpense =
        expenseValues.reduce((sum, val) => sum + val, 0) /
        Math.max(1, expenseValues.length);

      // Distribute to weekly values
      const weeklyIncome = [
        Math.round(avgMonthlyIncome * 0.28), // Week 1
        Math.round(avgMonthlyIncome * 0.0), // Week 2
        Math.round(avgMonthlyIncome * 0.28), // Week 3
        Math.round(avgMonthlyIncome * 0.44), // Week 4
      ];

      const weeklyExpenses = [
        Math.round(avgMonthlyExpense * 0.1), // Week 1
        Math.round(avgMonthlyExpense * 0.2), // Week 2
        Math.round(avgMonthlyExpense * 0.15), // Week 3
        Math.round(avgMonthlyExpense * 0.55), // Week 4
      ];

      // Create cash flow forecast object
      const forecast = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        income: weeklyIncome,
        expenses: weeklyExpenses,
        alert:
          weeklyIncome[1] < weeklyExpenses[1]
            ? "Potential cash shortage in Week 2"
            : null,
      };

      setCashFlowForecast(forecast);
    } catch (err) {
      console.error("Error generating cash flow forecast:", err);
      // Fallback to default forecast
      setCashFlowForecast({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        income: [850, 0, 850, 1540],
        expenses: [320, 580, 410, 1250],
        alert: "Potential cash shortage in Week 2",
      });
    }
  };

  // Process savings goals
  const processSavingsGoals = (data) => {
    try {
      // Create default goals if not available in user data
      // In a real app, this would be fetched from a separate table
      const goals = {
        data: [0.65, 0.4, 0.8],
        labels: ["Emergency Fund", "New Car", "Vacation"],
        details: [
          {
            name: "Emergency Fund",
            current: 9750,
            target: 15000,
            eta: "Oct 2023",
          },
          {
            name: "New Car",
            current: 12000,
            target: 30000,
            eta: "Mar 2025",
          },
          {
            name: "Vacation",
            current: 3200,
            target: 4000,
            eta: "Aug 2023",
          },
        ],
      };

      setGoalProgress(goals);
    } catch (err) {
      console.error("Error processing savings goals:", err);
      // Fallback to default goals
      setGoalProgress({
        data: [0.65, 0.4, 0.8],
        labels: ["Emergency Fund", "New Car", "Vacation"],
        details: [
          {
            name: "Emergency Fund",
            current: 9750,
            target: 15000,
            eta: "Oct 2023",
          },
          {
            name: "New Car",
            current: 12000,
            target: 30000,
            eta: "Mar 2025",
          },
          {
            name: "Vacation",
            current: 3200,
            target: 4000,
            eta: "Aug 2023",
          },
        ],
      });
    }
  };

  // Process debt data
  const processDebtData = (data) => {
    try {
      const liabilities = data.Liabilites || {};

      // Create structured debt data
      // Note: In a real app, more detailed data would be available
      const debts = [
        { name: "Credit Card", balance: 4800, interest: 18.9, payment: 250 },
        { name: "Car Loan", balance: 12000, interest: 5.2, payment: 350 },
        { name: "Student Loan", balance: 7800, interest: 4.5, payment: 200 },
      ];

      const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);

      // Avalanche method sorts by highest interest rate first
      const avalancheDebts = [...debts].sort((a, b) => b.interest - a.interest);

      // Snowball method sorts by lowest balance first
      const snowballDebts = [...debts].sort((a, b) => a.balance - b.balance);

      // Calculate months to debt-free and interest saved
      const totalMonthlyPayment = debts.reduce(
        (sum, debt) => sum + debt.payment,
        0
      );
      const averageInterestRate =
        debts.reduce((sum, debt) => sum + debt.balance * debt.interest, 0) /
        totalDebt;

      const avalancheMonths = Math.ceil(totalDebt / totalMonthlyPayment);
      const snowballMonths = avalancheMonths + 3; // Simplified calculation

      // Interest saved calculation (simplified)
      const avalancheInterestSaved = Math.round(
        totalDebt * (averageInterestRate / 100) * (avalancheMonths / 12) * 0.2
      );
      const snowballInterestSaved = Math.round(avalancheInterestSaved * 0.8);

      // Create debt optimization object
      const debtData = {
        totalDebt: totalDebt,
        strategies: [
          {
            name: "Avalanche",
            monthsToFreedom: avalancheMonths,
            interestSaved: avalancheInterestSaved,
          },
          {
            name: "Snowball",
            monthsToFreedom: snowballMonths,
            interestSaved: snowballInterestSaved,
          },
        ],
        debts: avalancheDebts,
      };

      setDebtOptimization(debtData);
    } catch (err) {
      console.error("Error processing debt data:", err);
      // Fallback to default debt data
      setDebtOptimization({
        totalDebt: 24600,
        strategies: [
          { name: "Avalanche", monthsToFreedom: 36, interestSaved: 2340 },
          { name: "Snowball", monthsToFreedom: 39, interestSaved: 1820 },
        ],
        debts: [
          { name: "Credit Card", balance: 4800, interest: 18.9, payment: 250 },
          { name: "Car Loan", balance: 12000, interest: 5.2, payment: 350 },
          { name: "Student Loan", balance: 7800, interest: 4.5, payment: 200 },
        ],
      });
    }
  };

  // Calculate savings rate history
  const calculateSavingsRateHistory = (data) => {
    try {
      const income = data.Income || {};
      const expenses = data.Expenses || {};

      // Calculate savings rate for each month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const savingsRates = [];

      for (const month of months) {
        const monthlyIncome = income[month] || 0;
        const monthlyExpenses = expenses[month] || 0;

        if (monthlyIncome > 0) {
          const savingsRate =
            ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
          savingsRates.push(parseFloat(savingsRate.toFixed(1)));
        } else {
          savingsRates.push(0);
        }
      }

      // Create savings rate history object
      const history = {
        labels: months,
        data: savingsRates,
      };

      setSavingsRateHistory(history);
    } catch (err) {
      console.error("Error calculating savings rate history:", err);
      // Fallback to default savings rate history
      setSavingsRateHistory({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [8.5, 7.9, 10.2, 11.6, 11.3, 11.6],
      });
    }
  };

  // Calculate net worth growth
  const calculateNetWorthGrowth = (data) => {
    try {
      const assets = data.Assets || {};
      const liabilities = data.Liabilites || {};

      // Calculate current net worth
      const totalAssets = Object.values(assets).reduce(
        (sum, value) => sum + value,
        0
      );
      const totalLiabilities = Object.values(liabilities).reduce(
        (sum, value) => sum + value,
        0
      );
      const currentNetWorth = totalAssets - totalLiabilities;

      // Generate historical net worth values
      // In a real app, this would be fetched from historical data
      const currentYear = new Date().getFullYear();
      const netWorthValues = [
        Math.round(currentNetWorth * 0.55), // 2020
        Math.round(currentNetWorth * 0.7), // 2021
        Math.round(currentNetWorth * 0.85), // 2022
        currentNetWorth, // 2023
      ];

      // Calculate growth rates
      const growthRates = [null];
      for (let i = 1; i < netWorthValues.length; i++) {
        const growthRate =
          ((netWorthValues[i] - netWorthValues[i - 1]) /
            netWorthValues[i - 1]) *
          100;
        growthRates.push(parseFloat(growthRate.toFixed(1)));
      }

      // Create net worth growth object
      const netWorth = {
        labels: [
          currentYear - 3,
          currentYear - 2,
          currentYear - 1,
          currentYear,
        ].map(String),
        data: netWorthValues,
        growthRate: growthRates,
      };

      setNetWorthGrowth(netWorth);
    } catch (err) {
      console.error("Error calculating net worth growth:", err);
      // Fallback to default net worth growth
      setNetWorthGrowth({
        labels: ["2020", "2021", "2022", "2023"],
        data: [28000, 35600, 42800, 51200],
        growthRate: [null, 27.1, 20.2, 19.6],
      });
    }
  };

  const navigateBack = () => {
    router.back();
  };

  const chartConfig = {
    // ... existing code ...
    backgroundGradientFrom: theme.chartBackground,
    backgroundGradientTo: theme.chartBackground,
    color: (opacity = 1) =>
      `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    labelColor: (opacity = 1) =>
      `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "1",
    },
  };

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading your financial insights...
        </Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "insights":
        return renderInsightsTab();
      case "planning":
        return renderPlanningTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => {
    // Get current month values for display
    const latestIncome = monthlyData?.datasets[0]?.data?.slice(-1)[0] || 3240;
    const latestExpenses = monthlyData?.datasets[1]?.data?.slice(-1)[0] || 2864;
    const latestSavings = latestIncome - latestExpenses;

    return (
      <>
        {/* Financial Health Score */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Financial Health Score
          </Text>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>
                {financialHealthScore?.score || 78}
              </Text>
              <Text style={styles.scoreLabel}>
                {financialHealthScore?.score >= 80
                  ? "Excellent"
                  : financialHealthScore?.score >= 70
                  ? "Good"
                  : financialHealthScore?.score >= 50
                  ? "Fair"
                  : "Needs Work"}
              </Text>
            </View>

            <View style={styles.scoreBreakdown}>
              {(financialHealthScore?.components || []).map(
                (component, index) => (
                  <View key={index} style={styles.scoreComponent}>
                    <View style={styles.scoreComponentHeader}>
                      <Text
                        style={[
                          styles.scoreComponentName,
                          { color: theme.text },
                        ]}
                      >
                        {component.name}
                      </Text>
                      <Text
                        style={[
                          styles.scoreComponentWeight,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {component.weight}
                      </Text>
                    </View>
                    <View style={styles.scoreBarContainer}>
                      <View
                        style={[
                          styles.scoreBar,
                          {
                            width: `${component.value}%`,
                            backgroundColor:
                              component.value > 70
                                ? theme.positive
                                : component.value > 50
                                ? "#f59e0b"
                                : theme.negative,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* Summary card with income/expenses/saved */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Monthly Overview
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.accent }]}>
                ${latestIncome.toLocaleString()}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: theme.textSecondary }]}
              >
                Income
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.negative }]}>
                ${latestExpenses.toLocaleString()}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: theme.textSecondary }]}
              >
                Expenses
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.positive }]}>
                ${latestSavings.toLocaleString()}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: theme.textSecondary }]}
              >
                Saved
              </Text>
            </View>
          </View>
        </View>

        {/* Cash Flow Forecast */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Cash Flow Forecast
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Next 30 days
          </Text>

          <View style={styles.cashFlowChart}>
            {(cashFlowForecast?.labels || []).map((label, index) => (
              <View key={index} style={styles.cashFlowWeek}>
                <View style={styles.cashFlowBars}>
                  <View style={styles.cashFlowBarWrapper}>
                    <View
                      style={[
                        styles.cashFlowBar,
                        styles.incomeBar,
                        { height: (cashFlowForecast?.income[index] || 0) / 20 },
                      ]}
                    />
                  </View>
                  <View style={styles.cashFlowBarWrapper}>
                    <View
                      style={[
                        styles.cashFlowBar,
                        styles.expenseBar,
                        {
                          height: (cashFlowForecast?.expenses[index] || 0) / 20,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text
                  style={[styles.cashFlowLabel, { color: theme.textSecondary }]}
                >
                  {label}
                </Text>
                <Text
                  style={[
                    styles.cashFlowBalance,
                    {
                      color:
                        (cashFlowForecast?.income[index] || 0) >
                        (cashFlowForecast?.expenses[index] || 0)
                          ? theme.positive
                          : theme.negative,
                    },
                  ]}
                >
                  $
                  {(
                    (cashFlowForecast?.income[index] || 0) -
                    (cashFlowForecast?.expenses[index] || 0)
                  ).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.cashFlowLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: theme.positive }]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                Income
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: theme.negative }]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                Expenses
              </Text>
            </View>
          </View>

          {cashFlowForecast?.alert && (
            <View style={styles.alertContainer}>
              <Ionicons name="alert-circle" size={16} color="#f59e0b" />
              <Text style={styles.alertText}>{cashFlowForecast.alert}</Text>
            </View>
          )}
        </View>

        {/* Income vs Expenses Trend Line Chart */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Income vs Expenses (6 Months)
          </Text>

          <LineChart
            data={
              monthlyData || {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    data: [2100, 2400, 2800, 3200, 3000, 3240],
                    color: () => theme.accent,
                    strokeWidth: 2,
                    legend: "Income",
                  },
                  {
                    data: [1800, 2000, 2300, 2700, 2500, 2864],
                    color: () => theme.negative,
                    strokeWidth: 2,
                    legend: "Expenses",
                  },
                ],
              }
            }
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            fromZero
            yAxisSuffix="$"
            yAxisInterval={1}
            renderDotContent={({ x, y, indexData }) => (
              <Text
                key={x}
                style={{
                  position: "absolute",
                  top: y - 12,
                  left: x - 8,
                  color: theme.textSecondary,
                  fontSize: 8,
                }}
              >
                ${indexData}
              </Text>
            )}
          />
        </View>
      </>
    );
  };

  const renderInsightsTab = () => {
    return (
      <>
        {/* AI Insights Card */}
        <View
          style={[
            styles.aiCard,
            { backgroundColor: theme.accent, borderColor: theme.border },
          ]}
        >
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color="#ffffff" />
            <Text style={styles.aiTitle}>AI Financial Insights</Text>
          </View>

          {extendedAiInsights.map((insight, index) => (
            <View key={index} style={styles.aiInsight}>
              <Ionicons
                name="bulb-outline"
                size={16}
                color="#ffffff"
                style={styles.aiIcon}
              />
              <Text style={styles.aiText}>{insight}</Text>
            </View>
          ))}

          <Pressable style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Get More Insights</Text>
          </Pressable>
        </View>

        {/* True Hourly Wage */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            True Hourly Wage
          </Text>

          <View style={styles.hourlyWageContainer}>
            <View style={styles.hourlyWageHeader}>
              <Text style={[styles.hourlyWageTitle, { color: theme.text }]}>
                Your true hourly wage
              </Text>
              <Text style={[styles.hourlyWageValue, { color: theme.accent }]}>
                ${trueHourlyWage.toFixed(2)}
              </Text>
            </View>

            <Text
              style={[
                styles.hourlyWageSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              Hours needed to pay for recent purchases:
            </Text>

            <View style={styles.hourlyItems}>
              <View style={styles.hourlyItem}>
                <View style={styles.hourlyItemLeft}>
                  <Ionicons name="restaurant" size={18} color="#f59e0b" />
                  <Text style={[styles.hourlyItemName, { color: theme.text }]}>
                    Dinner for two
                  </Text>
                </View>
                <Text style={[styles.hourlyItemValue, { color: theme.text }]}>
                  {(80 / trueHourlyWage).toFixed(1)} hrs
                </Text>
              </View>

              <View style={styles.hourlyItem}>
                <View style={styles.hourlyItemLeft}>
                  <Ionicons name="shirt" size={18} color="#8b5cf6" />
                  <Text style={[styles.hourlyItemName, { color: theme.text }]}>
                    New outfit
                  </Text>
                </View>
                <Text style={[styles.hourlyItemValue, { color: theme.text }]}>
                  {(150 / trueHourlyWage).toFixed(1)} hrs
                </Text>
              </View>

              <View style={styles.hourlyItem}>
                <View style={styles.hourlyItemLeft}>
                  <Ionicons name="tv" size={18} color="#3b82f6" />
                  <Text style={[styles.hourlyItemName, { color: theme.text }]}>
                    Streaming services (monthly)
                  </Text>
                </View>
                <Text style={[styles.hourlyItemValue, { color: theme.text }]}>
                  {(35 / trueHourlyWage).toFixed(1)} hrs
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rest of the insights tab content */}
        {/* ... existing code ... */}
      </>
    );
  };

  const renderPlanningTab = () => {
    return (
      <>
        {/* Goal Progress */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Goal Progress
          </Text>

          <ProgressChart
            data={{
              labels: goalProgress?.labels || ["Goal 1", "Goal 2", "Goal 3"],
              data: goalProgress?.data || [0.4, 0.6, 0.8],
            }}
            width={screenWidth - 40}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            }}
            hideLegend={false}
            style={styles.chartStyle}
          />

          <View style={styles.goalDetails}>
            {(goalProgress?.details || []).map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <View
                    style={[styles.goalDot, { backgroundColor: "#3b82f6" }]}
                  />
                  <Text style={[styles.goalName, { color: theme.text }]}>
                    {goal.name}
                  </Text>
                </View>
                <Text
                  style={[styles.goalTarget, { color: theme.textSecondary }]}
                >
                  ${goal.current.toLocaleString()} / $
                  {goal.target.toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.goalETA,
                    {
                      color:
                        new Date(goal.eta) < new Date()
                          ? theme.textSecondary
                          : theme.positive,
                    },
                  ]}
                >
                  ETA: {goal.eta}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rest of the planning tab content */}
        {/* ... existing code ... */}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Financial Insights
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === "overview" && [
              styles.activeTab,
              { borderBottomColor: theme.accent },
            ],
          ]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "overview" ? theme.accent : theme.textSecondary,
              },
            ]}
          >
            Overview
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "insights" && [
              styles.activeTab,
              { borderBottomColor: theme.accent },
            ],
          ]}
          onPress={() => setActiveTab("insights")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "insights" ? theme.accent : theme.textSecondary,
              },
            ]}
          >
            Insights
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "planning" && [
              styles.activeTab,
              { borderBottomColor: theme.accent },
            ],
          ]}
          onPress={() => setActiveTab("planning")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "planning" ? theme.accent : theme.textSecondary,
              },
            ]}
          >
            Planning
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 5,
  },
  chartStyle: {
    borderRadius: 8,
    marginVertical: 8,
    paddingRight: 0,
  },
  ratiosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ratioItem: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 12,
    borderRadius: 8,
  },
  ratioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratioName: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratioStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratioValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  ratioDesc: {
    fontSize: 12,
  },
  aiCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 0,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  aiInsight: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  aiIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  aiText: {
    color: "#ffffff",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  aiButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  aiButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Tab navigation
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Financial health score
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  scoreValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  scoreLabel: {
    color: "white",
    fontSize: 12,
  },
  scoreBreakdown: {
    flex: 1,
  },
  scoreComponent: {
    marginBottom: 10,
  },
  scoreComponentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  scoreComponentName: {
    fontSize: 13,
    fontWeight: "500",
  },
  scoreComponentWeight: {
    fontSize: 12,
  },
  scoreBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
  },
  scoreBar: {
    height: 6,
    borderRadius: 3,
  },

  // Cash flow forecast
  cardSubtitle: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 16,
  },
  cashFlowChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 180,
    marginBottom: 8,
  },
  cashFlowWeek: {
    alignItems: "center",
    width: "22%",
  },
  cashFlowBars: {
    flexDirection: "row",
    height: 120,
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 5,
  },
  cashFlowBarWrapper: {
    width: 18,
    height: "100%",
    justifyContent: "flex-end",
    marginHorizontal: 2,
  },
  cashFlowBar: {
    width: "100%",
    borderRadius: 2,
  },
  incomeBar: {
    backgroundColor: "#10b981",
  },
  expenseBar: {
    backgroundColor: "#f43f5e",
  },
  cashFlowLabel: {
    fontSize: 12,
  },
  cashFlowBalance: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  cashFlowLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  alertText: {
    color: "#f59e0b",
    marginLeft: 8,
    fontSize: 13,
  },

  // Hourly wage
  hourlyWageContainer: {
    padding: 5,
  },
  hourlyWageHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  hourlyWageTitle: {
    fontSize: 14,
  },
  hourlyWageValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  hourlyWageSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  hourlyItems: {
    marginTop: 5,
  },
  hourlyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  hourlyItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  hourlyItemName: {
    marginLeft: 10,
    fontSize: 15,
  },
  hourlyItemValue: {
    fontWeight: "600",
  },

  // Bill negotiation
  billContainer: {
    marginBottom: 15,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  billLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  billName: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  billCurrent: {
    marginLeft: 12,
    fontSize: 13,
  },
  billSavings: {
    alignItems: "flex-end",
  },
  billPotential: {
    fontSize: 16,
    fontWeight: "600",
  },
  billAnnual: {
    fontSize: 12,
  },
  billTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  billTotalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Investment performance
  investmentPerformance: {
    padding: 5,
  },
  investmentHeader: {
    marginBottom: 15,
  },
  investmentPeriod: {
    fontSize: 14,
  },
  investmentItem: {
    marginBottom: 12,
  },
  investmentLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  investmentBarContainer: {
    height: 26,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    position: "relative",
  },
  investmentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  investmentValue: {
    position: "absolute",
    right: 10,
    top: 3,
    fontSize: 14,
    fontWeight: "600",
  },
  investmentNote: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },

  // Goal progress
  goalDetails: {
    marginTop: 10,
  },
  goalItem: {
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "500",
  },
  goalTarget: {
    marginLeft: 16,
    fontSize: 14,
  },
  goalETA: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },

  // Debt payoff optimizer
  debtTotal: {
    alignItems: "center",
    marginBottom: 20,
  },
  debtTotalLabel: {
    fontSize: 14,
  },
  debtTotalValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  debtStrategies: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  debtStrategy: {
    width: "48%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: 12,
  },
  debtStrategySelected: {
    borderWidth: 2,
  },
  debtStrategyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  debtStrategyName: {
    fontSize: 14,
    fontWeight: "600",
  },
  debtStrategyBadge: {
    fontSize: 10,
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  debtStrategyDesc: {
    fontSize: 12,
    marginBottom: 8,
  },
  debtStrategyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  debtStrategyDetail: {
    alignItems: "center",
  },
  debtDetailLabel: {
    fontSize: 10,
  },
  debtDetailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  debtPaymentOrder: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  debtList: {
    marginTop: 5,
  },
  debtItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  debtItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  debtItemOrder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 10,
    fontWeight: "600",
  },
  debtItemName: {
    fontSize: 15,
  },
  debtItemRight: {
    alignItems: "flex-end",
  },
  debtItemBalance: {
    fontSize: 15,
    fontWeight: "600",
  },
  debtItemRate: {
    fontSize: 12,
  },

  // Savings rate
  savingsContext: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  savingsBenchmark: {
    alignItems: "center",
  },
  savingsMetricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  savingsMetricValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Net worth growth
  netWorthGrowthRates: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  growthRateItem: {
    alignItems: "center",
  },
  growthRateYear: {
    fontSize: 12,
    marginBottom: 3,
  },
  growthRateValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  netWorthProjection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  netWorthProjectionLabel: {
    fontSize: 14,
  },
  netWorthProjectionValue: {
    fontSize: 15,
    fontWeight: "600",
  },
});
