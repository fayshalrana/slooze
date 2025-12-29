import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import { useLayout } from "../contexts/LayoutContext";
import { Card } from "../components/Card";
import type { Product } from "../types";

export const AddProduct = () => {
  const navigate = useNavigate();
  const { addProductLayout } = useLayout();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "preview" | "thumbnail"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === "preview") {
          setPreviewImage(result);
        } else {
          setThumbnailImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "preview" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === "preview") {
          setPreviewImage(result);
        } else {
          setThumbnailImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: Number(formData.get("quantity")) || 0,
      unit: (formData.get("unit") as string) || "pcs",
      price: Number(formData.get("price")),
      description: (formData.get("description") as string) || undefined,
      image: thumbnailImage || previewImage || undefined,
    };

    try {
      await productService.create(productData);
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      navigate("/products");
    }
  };

  const isMinimal = addProductLayout === "minimal";

  return (
    <div className={isMinimal ? "max-w-2xl mx-auto space-y-4" : "space-y-6"}>
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          isMinimal ? "mb-4" : ""
        }`}
      >
        <div>
          <h1
            className={`font-bold text-gray-900 dark:text-white ${
              isMinimal ? "text-xl" : "text-3xl mb-1"
            }`}
          >
            Add Product
          </h1>
          {!isMinimal && (
            <p className="text-gray-600 dark:text-gray-400">Add New Product</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDiscard}
            className={`${
              isMinimal ? "px-3 py-1.5 text-sm" : "px-4 py-2"
            } bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all`}
          >
            {isMinimal ? "Cancel" : "Discard Change"}
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={loading}
            className={`${
              isMinimal ? "px-3 py-1.5 text-sm" : "px-4 py-2"
            } bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className={isMinimal ? "space-y-4" : "space-y-6"}
      >
        {isMinimal ? (
          // Minimal Layout
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Product Name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Grains">Grains</option>
                    <option value="Sweeteners">Sweeteners</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="pcs"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Product Image
                </label>
                <div
                  onDrop={(e) => handleImageDrop(e, "thumbnail")}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() =>
                    document.getElementById("thumbnail-upload-minimal")?.click()
                  }
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                    thumbnailImage || previewImage
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <input
                    id="thumbnail-upload-minimal"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, "thumbnail")}
                  />
                  {thumbnailImage || previewImage ? (
                    <div className="space-y-2">
                      <img
                        src={thumbnailImage || previewImage || ""}
                        alt="Product"
                        className="max-w-full h-24 object-contain mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnailImage(null);
                          setPreviewImage(null);
                        }}
                        className="text-red-500 hover:text-red-600 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <svg
                        className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          // Default Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Information */}
              <div className="bg-white dark:bg-[#151515] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  General Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Product Name"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Product Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                      >
                        <option value="">Product Category</option>
                        <option value="Grains">Grains</option>
                        <option value="Sweeteners">Sweeteners</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Meat">Meat</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                      </select>
                      <svg
                        className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
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
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Descriptions
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Description"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Tag Keywoder
                    </label>
                    <textarea
                      name="tags"
                      rows={3}
                      placeholder="Tag Keywoder"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white dark:bg-[#151515] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Pricing
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Proce
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      placeholder="Pricing"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Discount
                    </label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Discount"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      Discount Category
                    </label>
                    <div className="relative">
                      <select
                        name="discountCategory"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                      >
                        <option value="">Discount Category</option>
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed">Fixed Amount</option>
                      </select>
                      <svg
                        className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload Sections */}
            <div className="space-y-6">
              {/* Previews Product */}
              <div className="bg-white dark:bg-[#151515] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Previews Product
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Drag And Your Image Here
                </p>
                <div
                  onDrop={(e) => handleImageDrop(e, "preview")}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() =>
                    document.getElementById("preview-upload")?.click()
                  }
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    previewImage
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <input
                    id="preview-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, "preview")}
                  />
                  {previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-48 object-contain mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(null);
                        }}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Drag and drop here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Product */}
              <div className="bg-white dark:bg-[#151515] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Thumnail Product
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Drag And Your Image Here
                </p>
                <div
                  onDrop={(e) => handleImageDrop(e, "thumbnail")}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() =>
                    document.getElementById("thumbnail-upload")?.click()
                  }
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    thumbnailImage
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, "thumbnail")}
                  />
                  {thumbnailImage ? (
                    <div className="space-y-4">
                      <img
                        src={thumbnailImage}
                        alt="Thumbnail"
                        className="max-w-full h-32 object-contain mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnailImage(null);
                        }}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Drag and drop here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
