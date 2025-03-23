import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenWidth = Dimensions.get("window").width - 40;
  const [activeTab, setActiveTab] = useState("overview");

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

  const navigateBack = () => {
    router.back();
  };

  // Chart data
  const monthlyData = {
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
  };

  const categoryData = [
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
  ];

  const weeklySpendingData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [65, 42, 110, 35, 95, 180, 130],
      },
    ],
  };

  // Financial ratios
  const financialRatios = [
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
  ];

  // AI insights
  const aiInsights = [
    "You spent 15% more on dining out this month compared to your 3-month average",
    "Consider setting a budget for shopping as it has increased 23% over the last two months",
    "Your savings rate is improving - up 2.3% from last month",
    "Recurring subscriptions make up 8.5% of your monthly expenses",
  ];

  // New Financial Health Score data
  const financialHealthScore = {
    score: 78,
    maxScore: 100,
    components: [
      { name: "Savings Rate", value: 85, weight: "25%" },
      { name: "Debt-to-Income", value: 72, weight: "25%" },
      { name: "Emergency Fund", value: 65, weight: "25%" },
      { name: "Diversification", value: 90, weight: "25%" },
    ],
  };

  // Cash Flow Forecast
  const cashFlowForecast = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    income: [850, 0, 850, 1540],
    expenses: [320, 580, 410, 1250],
  };

  // Goal Progress
  const goalProgress = {
    data: [0.65, 0.4, 0.8],
    labels: ["Emergency Fund", "New Car", "Vacation"],
  };

  // Debt Optimization
  const debtOptimization = {
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
  };

  // Savings Rate History
  const savingsRateHistory = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [8.5, 7.9, 10.2, 11.6, 11.3, 11.6],
  };

  // Net Worth Growth
  const netWorthGrowth = {
    labels: ["2020", "2021", "2022", "2023"],
    data: [28000, 35600, 42800, 51200],
    growthRate: [null, 27.1, 20.2, 19.6],
  };

  // Extended AI Insights
  const extendedAiInsights = [
    "You spent 15% more on dining out this month compared to your 3-month average",
    "Consider setting a budget for shopping as it has increased 23% over the last two months",
    "Your savings rate is improving - up 2.3% from last month",
    "Recurring subscriptions make up 8.5% of your monthly expenses",
    "Your Netflix subscription appears unused in the last 60 days - consider pausing it to save $13.99/month",
    "Based on your income level, you'd need to work 5.2 hours to afford your average restaurant meal",
    "Your investment portfolio is outperforming the S&P 500 by 2.3% this quarter",
    "You could save approximately $450/year by negotiating your internet and phone bills",
  ];

  const chartConfig = {
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
                {financialHealthScore.score}
              </Text>
              <Text style={styles.scoreLabel}>Good</Text>
            </View>

            <View style={styles.scoreBreakdown}>
              {financialHealthScore.components.map((component, index) => (
                <View key={index} style={styles.scoreComponent}>
                  <View style={styles.scoreComponentHeader}>
                    <Text
                      style={[styles.scoreComponentName, { color: theme.text }]}
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
              ))}
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
                $3,240
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
                $2,864
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
                $376
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
            {cashFlowForecast.labels.map((label, index) => (
              <View key={index} style={styles.cashFlowWeek}>
                <View style={styles.cashFlowBars}>
                  <View style={styles.cashFlowBarWrapper}>
                    <View
                      style={[
                        styles.cashFlowBar,
                        styles.incomeBar,
                        { height: cashFlowForecast.income[index] / 20 },
                      ]}
                    />
                  </View>
                  <View style={styles.cashFlowBarWrapper}>
                    <View
                      style={[
                        styles.cashFlowBar,
                        styles.expenseBar,
                        { height: cashFlowForecast.expenses[index] / 20 },
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
                        cashFlowForecast.income[index] >
                        cashFlowForecast.expenses[index]
                          ? theme.positive
                          : theme.negative,
                    },
                  ]}
                >
                  $
                  {cashFlowForecast.income[index] -
                    cashFlowForecast.expenses[index]}
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

          <View style={styles.alertContainer}>
            <Ionicons name="alert-circle" size={16} color="#f59e0b" />
            <Text style={styles.alertText}>
              Potential cash shortage in Week 2
            </Text>
          </View>
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
            data={monthlyData}
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
                $24.75
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
                  3.2 hrs
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
                  5.8 hrs
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
                  1.4 hrs
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bill Negotiation Potential */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Bill Negotiation Potential
          </Text>

          <View style={styles.billContainer}>
            <View style={styles.billItem}>
              <View style={styles.billLeft}>
                <Ionicons name="wifi" size={20} color="#3b82f6" />
                <View>
                  <Text style={[styles.billName, { color: theme.text }]}>
                    Internet Service
                  </Text>
                  <Text
                    style={[styles.billCurrent, { color: theme.textSecondary }]}
                  >
                    Currently: $75/mo
                  </Text>
                </View>
              </View>
              <View style={styles.billSavings}>
                <Text style={[styles.billPotential, { color: theme.positive }]}>
                  -$25/mo
                </Text>
                <Text
                  style={[styles.billAnnual, { color: theme.textSecondary }]}
                >
                  $300/yr
                </Text>
              </View>
            </View>

            <View style={styles.billItem}>
              <View style={styles.billLeft}>
                <Ionicons name="phone-portrait" size={20} color="#8b5cf6" />
                <View>
                  <Text style={[styles.billName, { color: theme.text }]}>
                    Phone Plan
                  </Text>
                  <Text
                    style={[styles.billCurrent, { color: theme.textSecondary }]}
                  >
                    Currently: $55/mo
                  </Text>
                </View>
              </View>
              <View style={styles.billSavings}>
                <Text style={[styles.billPotential, { color: theme.positive }]}>
                  -$15/mo
                </Text>
                <Text
                  style={[styles.billAnnual, { color: theme.textSecondary }]}
                >
                  $180/yr
                </Text>
              </View>
            </View>

            <View style={styles.billItem}>
              <View style={styles.billLeft}>
                <Ionicons name="card" size={20} color="#f59e0b" />
                <View>
                  <Text style={[styles.billName, { color: theme.text }]}>
                    Credit Card Interest
                  </Text>
                  <Text
                    style={[styles.billCurrent, { color: theme.textSecondary }]}
                  >
                    Currently: 18.9% APR
                  </Text>
                </View>
              </View>
              <View style={styles.billSavings}>
                <Text style={[styles.billPotential, { color: theme.positive }]}>
                  -5.9%
                </Text>
                <Text
                  style={[styles.billAnnual, { color: theme.textSecondary }]}
                >
                  $283/yr
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.billTotal}>
            <Text
              style={[styles.billTotalLabel, { color: theme.textSecondary }]}
            >
              Potential Annual Savings:
            </Text>
            <Text style={[styles.billTotalValue, { color: theme.positive }]}>
              $763
            </Text>
          </View>
        </View>

        {/* Investment Performance vs Benchmarks */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Investment Performance
          </Text>

          <View style={styles.investmentPerformance}>
            <View style={styles.investmentHeader}>
              <Text
                style={[
                  styles.investmentPeriod,
                  { color: theme.textSecondary },
                ]}
              >
                YTD Returns
              </Text>
            </View>

            <View style={styles.investmentItem}>
              <Text style={[styles.investmentLabel, { color: theme.text }]}>
                Your Portfolio
              </Text>
              <View style={styles.investmentBarContainer}>
                <View
                  style={[
                    styles.investmentBar,
                    { width: "65%", backgroundColor: theme.accent },
                  ]}
                />
                <Text style={[styles.investmentValue, { color: theme.text }]}>
                  6.5%
                </Text>
              </View>
            </View>

            <View style={styles.investmentItem}>
              <Text style={[styles.investmentLabel, { color: theme.text }]}>
                S&P 500
              </Text>
              <View style={styles.investmentBarContainer}>
                <View
                  style={[
                    styles.investmentBar,
                    { width: "42%", backgroundColor: "#8b5cf6" },
                  ]}
                />
                <Text style={[styles.investmentValue, { color: theme.text }]}>
                  4.2%
                </Text>
              </View>
            </View>

            <View style={styles.investmentItem}>
              <Text style={[styles.investmentLabel, { color: theme.text }]}>
                Avg for Your Age
              </Text>
              <View style={styles.investmentBarContainer}>
                <View
                  style={[
                    styles.investmentBar,
                    { width: "38%", backgroundColor: "#f59e0b" },
                  ]}
                />
                <Text style={[styles.investmentValue, { color: theme.text }]}>
                  3.8%
                </Text>
              </View>
            </View>

            <Text style={[styles.investmentNote, { color: theme.positive }]}>
              ★ You're outperforming the market by 2.3%
            </Text>
          </View>
        </View>
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
              labels: goalProgress.labels,
              data: goalProgress.data,
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
            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <View
                  style={[styles.goalDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={[styles.goalName, { color: theme.text }]}>
                  Emergency Fund
                </Text>
              </View>
              <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>
                $9,750 / $15,000
              </Text>
              <Text style={[styles.goalETA, { color: theme.positive }]}>
                ETA: Oct 2023
              </Text>
            </View>

            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <View
                  style={[styles.goalDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={[styles.goalName, { color: theme.text }]}>
                  New Car
                </Text>
              </View>
              <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>
                $12,000 / $30,000
              </Text>
              <Text style={[styles.goalETA, { color: theme.textSecondary }]}>
                ETA: Mar 2025
              </Text>
            </View>

            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <View
                  style={[styles.goalDot, { backgroundColor: "#3b82f6" }]}
                />
                <Text style={[styles.goalName, { color: theme.text }]}>
                  Vacation
                </Text>
              </View>
              <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>
                $3,200 / $4,000
              </Text>
              <Text style={[styles.goalETA, { color: theme.positive }]}>
                ETA: Aug 2023
              </Text>
            </View>
          </View>
        </View>

        {/* Debt Payoff Optimizer */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Debt Payoff Optimizer
          </Text>

          <View style={styles.debtTotal}>
            <Text
              style={[styles.debtTotalLabel, { color: theme.textSecondary }]}
            >
              Total Debt
            </Text>
            <Text style={[styles.debtTotalValue, { color: theme.text }]}>
              ${debtOptimization.totalDebt}
            </Text>
          </View>

          <View style={styles.debtStrategies}>
            <View
              style={[
                styles.debtStrategy,
                styles.debtStrategySelected,
                { borderColor: theme.accent },
              ]}
            >
              <View style={styles.debtStrategyHeader}>
                <Text style={[styles.debtStrategyName, { color: theme.text }]}>
                  Avalanche Method
                </Text>
                <Text
                  style={[
                    styles.debtStrategyBadge,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  Recommended
                </Text>
              </View>
              <Text
                style={[
                  styles.debtStrategyDesc,
                  { color: theme.textSecondary },
                ]}
              >
                Pay highest interest first
              </Text>
              <View style={styles.debtStrategyDetails}>
                <View style={styles.debtStrategyDetail}>
                  <Text
                    style={[
                      styles.debtDetailLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Months to debt-free
                  </Text>
                  <Text style={[styles.debtDetailValue, { color: theme.text }]}>
                    36
                  </Text>
                </View>
                <View style={styles.debtStrategyDetail}>
                  <Text
                    style={[
                      styles.debtDetailLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Interest saved
                  </Text>
                  <Text
                    style={[styles.debtDetailValue, { color: theme.positive }]}
                  >
                    $2,340
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.debtStrategy}>
              <View style={styles.debtStrategyHeader}>
                <Text style={[styles.debtStrategyName, { color: theme.text }]}>
                  Snowball Method
                </Text>
              </View>
              <Text
                style={[
                  styles.debtStrategyDesc,
                  { color: theme.textSecondary },
                ]}
              >
                Pay smallest balance first
              </Text>
              <View style={styles.debtStrategyDetails}>
                <View style={styles.debtStrategyDetail}>
                  <Text
                    style={[
                      styles.debtDetailLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Months to debt-free
                  </Text>
                  <Text style={[styles.debtDetailValue, { color: theme.text }]}>
                    39
                  </Text>
                </View>
                <View style={styles.debtStrategyDetail}>
                  <Text
                    style={[
                      styles.debtDetailLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Interest saved
                  </Text>
                  <Text
                    style={[styles.debtDetailValue, { color: theme.positive }]}
                  >
                    $1,820
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={[styles.debtPaymentOrder, { color: theme.text }]}>
            Payment Order:
          </Text>

          <View style={styles.debtList}>
            {debtOptimization.debts.map((debt, index) => (
              <View key={index} style={styles.debtItem}>
                <View style={styles.debtItemLeft}>
                  <Text style={[styles.debtItemOrder, { color: theme.text }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.debtItemName, { color: theme.text }]}>
                    {debt.name}
                  </Text>
                </View>
                <View style={styles.debtItemRight}>
                  <Text style={[styles.debtItemBalance, { color: theme.text }]}>
                    ${debt.balance}
                  </Text>
                  <Text
                    style={[styles.debtItemRate, { color: theme.negative }]}
                  >
                    {debt.interest}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Savings Rate History */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Savings Rate History
          </Text>

          <LineChart
            data={{
              labels: savingsRateHistory.labels,
              datasets: [
                {
                  data: savingsRateHistory.data,
                  color: () => theme.positive,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            yAxisSuffix="%"
          />

          <View style={styles.savingsContext}>
            <View style={styles.savingsBenchmark}>
              <Text
                style={[
                  styles.savingsMetricLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Your Average
              </Text>
              <Text style={[styles.savingsMetricValue, { color: theme.text }]}>
                10.2%
              </Text>
            </View>
            <View style={styles.savingsBenchmark}>
              <Text
                style={[
                  styles.savingsMetricLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Recommended
              </Text>
              <Text style={[styles.savingsMetricValue, { color: theme.text }]}>
                15.0%
              </Text>
            </View>
            <View style={styles.savingsBenchmark}>
              <Text
                style={[
                  styles.savingsMetricLabel,
                  { color: theme.textSecondary },
                ]}
              >
                US Average
              </Text>
              <Text style={[styles.savingsMetricValue, { color: theme.text }]}>
                5.2%
              </Text>
            </View>
          </View>
        </View>

        {/* Net Worth Growth Rate */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Net Worth Growth
          </Text>

          <BarChart
            data={{
              labels: netWorthGrowth.labels,
              datasets: [{ data: netWorthGrowth.data }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            style={styles.chartStyle}
            fromZero
          />

          <View style={styles.netWorthGrowthRates}>
            {netWorthGrowth.growthRate.map((rate, index) => {
              if (rate === null) return null;
              return (
                <View key={index} style={styles.growthRateItem}>
                  <Text
                    style={[
                      styles.growthRateYear,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {netWorthGrowth.labels[index]}
                  </Text>
                  <Text
                    style={[styles.growthRateValue, { color: theme.positive }]}
                  >
                    +{rate}%
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.netWorthProjection}>
            <Text
              style={[
                styles.netWorthProjectionLabel,
                { color: theme.textSecondary },
              ]}
            >
              2024 Projection
            </Text>
            <Text
              style={[
                styles.netWorthProjectionValue,
                { color: theme.positive },
              ]}
            >
              $60,800 (+18.8%)
            </Text>
          </View>
        </View>
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
