import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { productService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLayout } from "../contexts/LayoutContext";
import { useTheme } from "../contexts/ThemeContext";
import { Tabs } from "../components/Tabs";
import { ActionButton } from "../components/ActionButton";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import type { Product } from "../types";
import {
  productNames,
  productCategories,
  productUnits,
  viewsChartData,
  salesChartData,
  earningsChartData,
} from "../data/mockData";

interface ProductRow extends Product {
  views: number;
  revenue: number;
  image?: string;
}

export const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] =
    useState<ProductRow | null>(null);
  const [activeTab, setActiveTab] = useState<"Published" | "Draft">(
    "Published"
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });
  const { hasRole } = useAuth();
  const { productsLayout } = useLayout();
  const { theme } = useTheme();

  // Chart theme colors
  const isDark = theme === "dark";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#151515" : "white";
  const tooltipBorder = isDark ? "#404040" : "#e5e7eb";
  const tooltipText = isDark ? "#ffffff" : "#1f2937";
  const gridColor = isDark ? "#404040" : "#e5e7eb";

  const canEdit = hasRole("Manager") || hasRole("Store Keeper");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDownloadMenu && !target.closest(".download-menu-container")) {
        setShowDownloadMenu(false);
      }
    };

    if (showDownloadMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDownloadMenu]);

  // Fetch and generate products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();

      const allProducts: ProductRow[] = [];

      // Use existing products first
      const existingProducts: ProductRow[] = data.map((product) => ({
        ...product,
        views: Math.floor(Math.random() * 50000) + 10000,
        revenue: Math.floor(Math.random() * 200000) + 50000,
      }));

      allProducts.push(...existingProducts);

      // Generate additional products to reach 50
      for (let i = existingProducts.length; i < 50; i++) {
        const name = productNames[i % productNames.length];
        const category = productCategories[i % productCategories.length];
        const unit = productUnits[i % productUnits.length];

        allProducts.push({
          id: String(i + 1),
          name: `${name} ${
            i > productNames.length
              ? `#${Math.floor(i / productNames.length) + 1}`
              : ""
          }`.trim(),
          category,
          quantity: Math.floor(Math.random() * 5000) + 100,
          unit,
          price: Math.floor(Math.random() * 200) + 10,
          description: `Quality ${name.toLowerCase()}`,
          createdAt: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date().toISOString(),
          views: Math.floor(Math.random() * 50000) + 10000,
          revenue: Math.floor(Math.random() * 200000) + 50000,
        });
      }

      setProducts(allProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
      setProductToDelete(null);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit") as string,
      price: Number(formData.get("price")),
      description: (formData.get("description") as string) || undefined,
    };

    try {
      await productService.update(editingProduct.id, productData);
      setShowEditForm(false);
      setEditingProduct(null);
      toast.success(`Product "${productData.name}" updated successfully`);
      fetchProducts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingProduct(null);
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProducts(newSelected);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort();

  // Apply filters
  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.startDate) {
      const productDate = new Date(product.createdAt);
      const startDate = new Date(filters.startDate);
      if (productDate < startDate) return false;
    }
    if (filters.endDate) {
      const productDate = new Date(product.createdAt);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      if (productDate > endDate) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    let aVal: any = a[sortField as keyof ProductRow];
    let bVal: any = b[sortField as keyof ProductRow];

    if (sortField === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    toast.success("Filters applied");
  };

  const handleProductNameClick = (product: ProductRow) => {
    setSelectedProductForDetails(product);
    setShowProductDetailsModal(true);
  };

  // Download functions
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Products Report", 14, 22);

      // Add date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare table data
      const tableData = sortedProducts.map((product) => [
        product.name,
        product.category,
        `${product.quantity} ${product.unit}`,
        `$${product.price.toFixed(2)}`,
        new Date(product.createdAt).toLocaleDateString(),
      ]);

      // Add table
      autoTable(doc, {
        head: [["Name", "Category", "Quantity", "Price", "Created Date"]],
        body: tableData,
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Save PDF
      doc.save(`products-report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF downloaded successfully");
      setShowDownloadMenu(false);
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const totalViews = 112893;
  const trendPercentage = 70.5;
  const totalSales = 6450;
  const salesTrendPercentage = 65.2;
  const totalEarnings = products.reduce((sum, p) => sum + p.revenue, 0);
  const earningsTrendPercentage = 72.8;

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400 text-lg">
        Loading products...
      </div>
    );
  }

  if (error && !products.length) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 max-w-full overflow-x-hidden">
      {/* Main Content */}
      <div className="flex-1 min-w-0 max-w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Product
        </h1>

        {/* Product Table or Card View */}
        <Card className="overflow-hidden">
          {/* Tabs and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 py-4 px-3 sm:px-5">
            <Tabs
              tabs={[
                { id: "Published", label: "Published" },
                { id: "Draft", label: "Draft" },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) =>
                setActiveTab(tabId as "Published" | "Draft")
              }
            />
            <div className="flex items-center gap-2 sm:gap-3 relative">
              <ActionButton
                label="Filter"
                onClick={() => setShowFilterModal(true)}
                icon={
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                }
              />
              <div className="relative download-menu-container">
                <ActionButton
                  label="Download"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  icon={
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  }
                />
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#151515] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors rounded-lg"
                    >
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
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Download as PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {productsLayout === "card" ? (
            /* Card View */
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = "📱";
                                  parent.className =
                                    "w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0";
                                }
                              }}
                            />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => handleProductNameClick(product)}
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) =>
                          handleSelectProduct(product.id, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Views
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Price
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Revenue
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          ${product.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Table View
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white"
                      >
                        Product Name
                        <svg
                          className="w-3 h-3 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("views")}
                        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white ml-auto"
                      >
                        Views
                        {sortField === "views" ? (
                          sortDirection === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
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
                          )
                        ) : (
                          <svg
                            className="w-3 h-3 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("price")}
                        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white ml-auto"
                      >
                        Pricing
                        {sortField === "price" ? (
                          sortDirection === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
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
                          )
                        ) : (
                          <svg
                            className="w-3 h-3 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("revenue")}
                        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white ml-auto"
                      >
                        Revenue
                        {sortField === "revenue" ? (
                          sortDirection === "asc" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
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
                          )
                        ) : (
                          <svg
                            className="w-3 h-3 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left lg:pr-[3rem]">
                      <button className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white ml-auto">
                        Manage
                        <svg
                          className="w-3 h-3 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={(e) =>
                              handleSelectProduct(product.id, e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = "📱";
                                    parent.className =
                                      "w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl";
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-2xl">📱</span>
                            )}
                          </div>
                          <span
                            className="text-gray-900 dark:text-white font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => handleProductNameClick(product)}
                          >
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {product.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleEdit(product)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md transition-all"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-3 sm:px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of{" "}
              {sortedProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                &gt;
              </button>
            </div>
          </div>
        </Card>

        {/* Edit Form Modal */}
        {showEditForm && editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#151515] rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Product
              </h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingProduct?.category}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={editingProduct?.quantity}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                      Unit
                    </label>
                    <input
                      type="text"
                      name="unit"
                      defaultValue={editingProduct?.unit}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingProduct?.price}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-900 dark:text-white font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-all"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#151515] rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Delete Product
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {productToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {showProductDetailsModal && selectedProductForDetails && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProductDetailsModal(false)}
          >
            <div
              className="bg-white dark:bg-[#151515] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Product Details
                </h2>
                <button
                  onClick={() => setShowProductDetailsModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedProductForDetails.image ? (
                      <img
                        src={selectedProductForDetails.image}
                        alt={selectedProductForDetails.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "📱";
                            parent.className =
                              "w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-6xl";
                          }
                        }}
                      />
                    ) : (
                      <span className="text-6xl">📱</span>
                    )}
                  </div>
                </div>

                {/* Product Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Product Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedProductForDetails.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedProductForDetails.category}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Quantity
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedProductForDetails.quantity}{" "}
                      {selectedProductForDetails.unit}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Price
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      $
                      {selectedProductForDetails.price.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Views
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedProductForDetails.views.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Revenue
                    </label>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      $
                      {selectedProductForDetails.revenue.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Created Date
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {new Date(
                        selectedProductForDetails.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Updated Date
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {new Date(
                        selectedProductForDetails.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedProductForDetails.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Description
                    </label>
                    <p className="text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {selectedProductForDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowFilterModal(false)}
          >
            <div
              className="bg-white dark:bg-[#151515] rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Filter Products
              </h2>
              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      placeholder="Any"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowFilterModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md font-semibold transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Analytics Panel */}
      <div className="w-full xl:w-96 xl:flex-shrink-0">
        <div className="xl:sticky xl:top-24">
          <Button
            onClick={() => navigate("/products/add")}
            variant="primary"
            fullWidth
            className="mb-4 bg-purple-500 hover:bg-purple-600 w-full xl:max-w-max xl:ml-auto justify-center"
            icon={<span className="text-lg">+</span>}
          >
            Add New Product
          </Button>
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Total Views
            </h3>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                + {totalViews.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  trend title
                </span>
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {trendPercentage}%
                </span>
              </div>
            </div>
            <ResponsiveContainer key={theme} width="100%" height={200}>
              <LineChart data={viewsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                />
                <YAxis
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                  domain={[0, "dataMax"]}
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
                  dataKey="views"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="mt-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Total Sales
            </h3>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                + {totalSales.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  trend title
                </span>
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {salesTrendPercentage}%
                </span>
              </div>
            </div>
            <ResponsiveContainer key={theme} width="100%" height={150}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                />
                <YAxis
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                  domain={[0, "dataMax"]}
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
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="mt-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Total Earnings
            </h3>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                $ {totalEarnings.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  trend title
                </span>
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {earningsTrendPercentage}%
                </span>
              </div>
            </div>
            <ResponsiveContainer key={theme} width="100%" height={150}>
              <LineChart data={earningsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                />
                <YAxis
                  stroke={axisColor}
                  fontSize={10}
                  tick={{ fill: axisColor }}
                  domain={[0, "dataMax"]}
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
                  dataKey="earnings"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};
