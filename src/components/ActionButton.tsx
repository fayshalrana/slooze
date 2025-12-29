import { ReactNode } from "react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

export const ActionButton = ({
  label,
  onClick,
  icon,
  className = "",
}: ActionButtonProps) => {
  const defaultIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm ${className}`}
    >
      {label}
      {icon || defaultIcon}
    </button>
  );
};

