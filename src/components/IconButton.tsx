import { ReactNode } from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  className?: string;
  ariaLabel?: string;
  badge?: boolean;
  children?: ReactNode;
}

export const IconButton = ({
  onClick,
  icon,
  className = "",
  ariaLabel,
  badge = false,
  children,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent backdrop-blur-sm flex items-center justify-center hover:bg-blue-100/70 dark:hover:bg-gray-800 transition-all relative ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
      {children}
    </button>
  );
};

