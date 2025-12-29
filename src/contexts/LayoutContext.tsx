import { createContext, useContext, useState, ReactNode } from "react";

type LayoutMode = "default" | "grid" | "card" | "minimal";

interface LayoutContextType {
  dashboardLayout: LayoutMode;
  productsLayout: LayoutMode;
  addProductLayout: LayoutMode;
  toggleDashboardLayout: () => void;
  toggleProductsLayout: () => void;
  toggleAddProductLayout: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardLayout, setDashboardLayout] = useState<LayoutMode>("default");
  const [productsLayout, setProductsLayout] = useState<LayoutMode>("default");
  const [addProductLayout, setAddProductLayout] = useState<LayoutMode>("default");

  const toggleDashboardLayout = () => {
    setDashboardLayout((prev) => (prev === "default" ? "grid" : "default"));
  };

  const toggleProductsLayout = () => {
    setProductsLayout((prev) => (prev === "default" ? "card" : "default"));
  };

  const toggleAddProductLayout = () => {
    setAddProductLayout((prev) => (prev === "default" ? "minimal" : "default"));
  };

  return (
    <LayoutContext.Provider
      value={{
        dashboardLayout,
        productsLayout,
        addProductLayout,
        toggleDashboardLayout,
        toggleProductsLayout,
        toggleAddProductLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

