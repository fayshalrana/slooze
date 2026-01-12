import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "../services/api";
import { Button } from "../components/Button";
import { KPICard } from "../components/KPICard";
import { Card } from "../components/Card";
import { useTheme } from "../contexts/ThemeContext";
import { useLayout } from "../contexts/LayoutContext";
import { useTranslation } from "../hooks/useTranslation";
import type { DashboardStats } from "../types";
import {
  overviewData,
  weeklyData,
  smallBarData,
  earningLineData,
  salesLineData,
  viewsLineData,
  subscriptionsData,
  subscriptionsPerformersData,
  recentSales,
  topProducts,
  paymentHistory,
} from "../data/mockData";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { dashboardLayout } = useLayout();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chart theme colors
  const isDark = theme === "dark";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#151515" : "white";
  const tooltipBorder = isDark ? "#404040" : "#e5e7eb";
  const tooltipText = isDark ? "#ffffff" : "#1f2937";
  const primaryColor = isDark ? "#f97316" : "#3b82f6";
  const secondaryColor = isDark ? "#14b8a6" : "#10b981";

  // Calculate chart data with background bars
  const maxValue = Math.max(...overviewData.map((d) => d.value)) * 1.1;
  const overviewDataWithBackground = overviewData.map((d) => ({
    ...d,
    remaining: maxValue - d.value,
  }));

  const weeklyMaxValue = Math.max(...weeklyData.map((d) => d.value)) * 1.1;
  const weeklyDataWithBackground = weeklyData.map((d) => ({
    ...d,
    remaining: weeklyMaxValue - d.value,
  }));

  const smallBarMaxValue = Math.max(...smallBarData.map((d) => d.value)) * 1.1;
  const smallBarDataWithBackground = smallBarData.map((d) => ({
    ...d,
    remaining: smallBarMaxValue - d.value,
  }));

  const subscriptionsPerformersMaxValue =
    Math.max(...subscriptionsPerformersData.map((d) => d.value)) * 1.1;
  const subscriptionsPerformersDataWithBackground =
    subscriptionsPerformersData.map((d) => ({
      ...d,
      remaining: subscriptionsPerformersMaxValue - d.value,
    }));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t("dashboard.failedToLoad");
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400 text-lg">
        {t("dashboard.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const totalEarning = 112893;
  const trendPercentage = 70.5;

  return (
    <div
      className={`${
        dashboardLayout === "grid" ? "p-2 sm:p-4" : "space-y-4 sm:space-y-6"
      } max-w-full overflow-x-hidden`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("dashboard.title")}
        </h1>
        <Button
          onClick={() => navigate("/products/add")}
          icon={<span className="text-lg">+</span>}
        >
          {t("dashboard.addNewProduct")}
        </Button>
      </div>

      {dashboardLayout === "grid" ? (
        // Grid Layout
        <div className="space-y-4">
          {/* KPI Cards in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t("dashboard.totalEarning")}
              value={`$${totalEarning.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="💰"
            />
            <KPICard
              title={t("dashboard.views")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="👁️"
            />
            <KPICard
              title={t("dashboard.totalSales")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="📊"
            />
            <KPICard
              title={t("dashboard.subscriptions")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="📈"
            />
          </div>

          {/* Overview and Recent Sales in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t("dashboard.overview")}
              </h2>
              <ResponsiveContainer key={theme} width="100%" height={400}>
                <BarChart data={overviewDataWithBackground}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="0" />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{ fill: axisColor }}
                  />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    stackId="stack"
                    fill={primaryColor}
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: secondaryColor }}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    activeBar={{ fill: "url(#barGradient)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.recentSales")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("dashboard.salesThisMonth", { count: 350 })}
              </p>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      {sale.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {sale.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {sale.email}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                      +${sale.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stats Section in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {t("dashboard.totalEarning")}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    ${" "}
                    {totalEarning.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                    {t("dashboard.trendTitle")} {trendPercentage}%
                  </p>
                </div>
                <select className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white">
                  <option>{t("dashboard.thisWeek")}</option>
                </select>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={150}>
                <LineChart data={earningLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="0" />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 10 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={secondaryColor}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke={isDark ? "#404040" : "#9ca3af"}
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {t("dashboard.weeklyStats")}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    ${" "}
                    {totalEarning.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                    {t("dashboard.trendTitle")} {trendPercentage}%
                  </p>
                </div>
                <select className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white">
                  <option>{t("dashboard.thisWeek")}</option>
                </select>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={150}>
                <BarChart data={weeklyDataWithBackground}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="0" />
                  <XAxis
                    dataKey="day"
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 10 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    stackId="stack"
                    fill={secondaryColor}
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: secondaryColor }}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    activeBar={{ fill: "url(#barGradient)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Additional Stats in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {t("dashboard.subscriptions")}
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  + {totalEarning.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  {t("dashboard.trendTitle")} {trendPercentage}%
                </p>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={120}>
                <LineChart data={subscriptionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="none" />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 8 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 8 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={secondaryColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {t("dashboard.totalEarning")}
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  ${" "}
                  {totalEarning.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  {t("dashboard.trendTitle")} {trendPercentage}%
                </p>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={120}>
                <BarChart data={smallBarDataWithBackground}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="0" />
                  <XAxis dataKey="name" stroke="none" tick={false} />
                  <YAxis stroke="none" tick={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    stackId="stack"
                    fill={secondaryColor}
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: secondaryColor }}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    activeBar={{ fill: "url(#barGradient)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.subscriptionsPerformers")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t("dashboard.followerThisYears")}
              </p>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +500
                </p>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">↑</span>
                </div>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={120}>
                <BarChart data={subscriptionsPerformersDataWithBackground}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="none" />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{ fill: axisColor }}
                    hide
                  />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    stackId="stack"
                    fill={primaryColor}
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: primaryColor }}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    activeBar={{ fill: "url(#barGradient)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bottom Row in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.topSalesProduct")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t("dashboard.manageYourPayments")}
              </p>
              <div className="space-y-2 mb-3">
                {topProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-lg">{product.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {product.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {product.date}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      ${product.amount}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-xs">
                  {t("dashboard.previous")}
                </button>
                <button className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-xs">
                  {t("dashboard.next")}
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.paymentHistory")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t("dashboard.manageYourPayments")}
              </p>
              <div className="space-y-2 mb-3">
                {paymentHistory.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={payment.status === "Success"}
                        readOnly
                        className="w-3 h-3 text-green-500 rounded cursor-pointer"
                      />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 dark:text-white truncate">
                        {payment.email}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      ${payment.amount}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-xs">
                  {t("dashboard.previous")}
                </button>
                <button className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-xs">
                  {t("dashboard.next")}
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {t("dashboard.totalEarning")}
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  + {totalEarning.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  {t("dashboard.trendTitle")} {trendPercentage}%
                </p>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={100}>
                <LineChart data={salesLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="none" />
                  <XAxis
                    dataKey="date"
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 8 }}
                  />
                  <YAxis
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 8 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={secondaryColor}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke={isDark ? "#404040" : "#9ca3af"}
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ) : (
        // Default Layout
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <KPICard
              title={t("dashboard.totalEarning")}
              value={`$${totalEarning.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="💰"
            />
            <KPICard
              title={t("dashboard.views")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="👁️"
            />
            <KPICard
              title={t("dashboard.totalSales")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="📊"
            />
            <KPICard
              title={t("dashboard.subscriptions")}
              value={`+ ${totalEarning.toLocaleString()}`}
              trend={{
                label: t("dashboard.trendTitle"),
                percentage: trendPercentage,
              }}
              icon="📈"
            />
          </div>

          {/* Overview and Recent Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            <Card className="lg:col-span-2 overflow-x-hidden">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">
                {t("dashboard.overview")}
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-0 h-[300px] sm:h-[500px]">
                  <ResponsiveContainer key={theme} width="100%" height="100%">
                    <BarChart data={overviewDataWithBackground}>
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={isDark ? "#000" : "#e5e7eb"}
                            stopOpacity="0"
                          />
                          <stop
                            offset="50%"
                            stopColor={isDark ? "#000" : "#e5e7eb"}
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor={isDark ? "#000" : "#e5e7eb"}
                            stopOpacity="0.9"
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="0" />
                      <XAxis
                        dataKey="month"
                        stroke={axisColor}
                        tick={{ fill: axisColor }}
                      />
                      <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: "8px",
                          color: tooltipText,
                        }}
                        labelStyle={{ color: tooltipText }}
                        cursor={false}
                      />
                      <Bar
                        dataKey="value"
                        stackId="stack"
                        fill={primaryColor}
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: secondaryColor }}
                      />
                      <Bar
                        dataKey="remaining"
                        stackId="stack"
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                        activeBar={{ fill: "url(#barGradient)" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.recentSales")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("dashboard.salesThisMonth", { count: 350 })}
              </p>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {sale.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.email}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +${sale.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stats Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.stats")}
              </h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>{t("dashboard.years")}</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>Aug 20th - Dec 4th</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>{t("dashboard.comparedToPrevious")}</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>2024</option>
                </select>
                <button className="px-4 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t("dashboard.add")}
                </button>
                <button className="px-4 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t("dashboard.edit")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("dashboard.totalEarning")}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${" "}
                      {totalEarning.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {t("dashboard.trendTitle")} {trendPercentage}%
                    </p>
                  </div>
                  <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white">
                    <option>{t("dashboard.thisWeek")}</option>
                  </select>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={200}>
                  <LineChart data={earningLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="0" />
                    <XAxis
                      dataKey="month"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                    />
                    <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={secondaryColor}
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke={isDark ? "#404040" : "#9ca3af"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("dashboard.totalEarning")}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${" "}
                      {totalEarning.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {t("dashboard.trendTitle")} {trendPercentage}%
                    </p>
                  </div>
                  <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white">
                    <option>{t("dashboard.thisWeek")}</option>
                  </select>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={200}>
                  <BarChart data={weeklyDataWithBackground}>
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0"
                        />
                        <stop
                          offset="50%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="0" />
                    <XAxis
                      dataKey="day"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                    />
                    <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                      cursor={false}
                    />
                    <Bar
                      dataKey="value"
                      stackId="stack"
                      fill={secondaryColor}
                      radius={[4, 4, 0, 0]}
                      activeBar={{ fill: secondaryColor }}
                    />
                    <Bar
                      dataKey="remaining"
                      stackId="stack"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                      activeBar={{ fill: "url(#barGradient)" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("dashboard.subscriptions")}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      + {totalEarning.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {t("dashboard.trendTitle")} {trendPercentage}%
                    </p>
                  </div>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={300}>
                  <LineChart data={subscriptionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis
                      dataKey="month"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                    />
                    <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={secondaryColor}
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("dashboard.totalEarning")}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${" "}
                      {totalEarning.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {t("dashboard.trendTitle")} {trendPercentage}%
                    </p>
                  </div>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={300}>
                  <BarChart data={smallBarDataWithBackground}>
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0"
                        />
                        <stop
                          offset="50%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor={isDark ? "#000" : "#e5e7eb"}
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="0" />
                    <XAxis dataKey="name" stroke="none" tick={false} />
                    <YAxis stroke="none" tick={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                      cursor={false}
                    />
                    <Bar
                      dataKey="value"
                      stackId="stack"
                      fill={secondaryColor}
                      radius={[4, 4, 0, 0]}
                      activeBar={{ fill: secondaryColor }}
                    />
                    <Bar
                      dataKey="remaining"
                      stackId="stack"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                      activeBar={{ fill: "url(#barGradient)" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stats Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.stats")}
              </h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>{t("dashboard.years")}</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>Aug 20th - Dec 4th</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>{t("dashboard.comparedToPrevious")}</option>
                </select>
                <select className="px-3 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>2024</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("dashboard.totalEarning")}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    + {totalEarning.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                    {t("dashboard.trendTitle")} {trendPercentage}%
                  </p>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={150}>
                  <LineChart data={salesLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis
                      dataKey="date"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <YAxis
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={secondaryColor}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke={isDark ? "#404040" : "#9ca3af"}
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("dashboard.totalSales")}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    + {totalEarning.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                    {t("dashboard.trendTitle")} {trendPercentage}%
                  </p>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={150}>
                  <LineChart data={salesLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis
                      dataKey="date"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <YAxis
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={primaryColor}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke={isDark ? "#404040" : "#9ca3af"}
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("dashboard.totalViews")}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    + {totalEarning.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                    {t("dashboard.trendTitle")} {trendPercentage}%
                  </p>
                </div>
                <ResponsiveContainer key={theme} width="100%" height={150}>
                  <LineChart data={viewsLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis
                      dataKey="date"
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <YAxis
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      fontSize={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                      }}
                      labelStyle={{ color: tooltipText }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={primaryColor}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke={isDark ? "#404040" : "#9ca3af"}
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.subscriptionsPerformers")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("dashboard.followerThisYears")}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  +500
                </p>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">↑</span>
                </div>
              </div>
              <ResponsiveContainer key={theme} width="100%" height={300}>
                <BarChart data={subscriptionsPerformersDataWithBackground}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#000" : "#e5e7eb"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="none" />
                  <XAxis
                    dataKey="month"
                    stroke={axisColor}
                    tick={{ fill: axisColor }}
                    hide
                  />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      color: tooltipText,
                    }}
                    labelStyle={{ color: tooltipText }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    stackId="stack"
                    fill={primaryColor}
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: primaryColor }}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    activeBar={{ fill: "url(#barGradient)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <button className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all">
                {t("dashboard.getStarted")}
              </button>
            </div>

            <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.topSalesProduct")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("dashboard.manageYourPayments")}
              </p>
              <div className="space-y-3 mb-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-2xl">{product.image}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.date}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${product.amount}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-sm">
                  {t("dashboard.previous")}
                </button>
                <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-sm">
                  {t("dashboard.next")}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("dashboard.paymentHistory")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("dashboard.manageYourPayments")}
              </p>
              <div className="space-y-3 mb-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={payment.status === "Success"}
                        readOnly
                        className="w-4 h-4 text-green-500 rounded cursor-pointer"
                      />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.email}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${payment.amount}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-sm">
                  {t("dashboard.previous")}
                </button>
                <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all text-sm">
                  {t("dashboard.next")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
