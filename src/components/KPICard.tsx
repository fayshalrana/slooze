import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    label: string;
    percentage: number;
    isPositive?: boolean;
  };
  icon: ReactNode;
  className?: string;
}

export const KPICard = ({
  title,
  value,
  trend,
  icon,
  className = "",
}: KPICardProps) => {
  return (
    <div
      className={`bg-white dark:bg-[#151515] rounded-xl p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {title}
        </h3>
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      {trend && (
        <p
          className={`text-sm font-medium ${
            trend.isPositive !== false
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend.label} {trend.percentage}%
        </p>
      )}
    </div>
  );
};

