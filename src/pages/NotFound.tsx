import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

export const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9eef4] dark:bg-black">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t("notFound.pageNotFound")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            {t("notFound.message")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
          >
            {t("notFound.goBack")}
          </button>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
          >
            {t("notFound.goToProducts")}
          </button>
        </div>
      </div>
    </div>
  );
};

