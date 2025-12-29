import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 bg-gray-100 dark:bg-[#151515] border-b border-gray-200 dark:border-gray-700 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white m-0">
            Commodities Management
          </h1>
        </div>
        <div className="flex gap-4 md:gap-6 flex-1 justify-center w-full md:w-auto">
          {hasRole('Manager') && (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/products"
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              isActive('/products')
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Products
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="flex flex-col items-end text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-all hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  );
};

