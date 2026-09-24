"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  deleteProduct,
} from "../../services/productService";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [initialized, setInitialized] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------
  // Read URL parameters
  // ---------------------------------------
  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 10;
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSort = searchParams.get("sort") || "";

    setPage(urlPage);
    setLimit(urlLimit);
    setSearch(urlSearch);
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setSortBy(urlSort);

    setInitialized(true);
  }, [searchParams]);

  // ---------------------------------------
  // Update URL
  // ---------------------------------------
  const updateURL = ({
    newPage = page,
    newLimit = limit,
    newSearch = searchQuery,
    newCategory = selectedCategory,
    newSort = sortBy,
  }) => {
    const params = new URLSearchParams();

    params.set("page", newPage);
    params.set("limit", newLimit);

    if (newSearch) {
      params.set("search", newSearch);
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSort) {
      params.set("sort", newSort);
    }

    router.push(`/products?${params.toString()}`);
  };

  // ---------------------------------------
  // Fetch Categories
  // ---------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data || []);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  // ---------------------------------------
  // Sort Products
  // ---------------------------------------
  const sortProducts = (items) => {
    const sortedItems = [...items];

    if (sortBy === "price-asc") {
      sortedItems.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      sortedItems.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating-desc") {
      sortedItems.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "rating-asc") {
      sortedItems.sort((a, b) => a.rating - b.rating);
    }

    if (sortBy === "title-asc") {
      sortedItems.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "title-desc") {
      sortedItems.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return sortedItems;
  };

  // ---------------------------------------
  // Fetch Products
  // ---------------------------------------
  useEffect(() => {
    if (!initialized) {
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * limit;

        let data;

        if (searchQuery) {
          data = await searchProducts(
            searchQuery,
            limit,
            skip
          );
        } else if (selectedCategory) {
          data = await getProductsByCategory(
            selectedCategory,
            limit,
            skip
          );
        } else {
          data = await getProducts(limit, skip);
        }

        if (cancelled) {
          return;
        }

        const sortedProducts = sortProducts(
          data.products || []
        );

        setProducts(sortedProducts);
        setTotal(data.total || 0);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Products fetch error:", error);

        setError(
          "Failed to load products. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    initialized,
    page,
    limit,
    searchQuery,
    selectedCategory,
    sortBy,
  ]);

  // ---------------------------------------
  // Search
  // ---------------------------------------
  const handleSearch = (e) => {
    e.preventDefault();

    updateURL({
      newPage: 1,
      newSearch: search,
      newCategory: selectedCategory,
      newSort: sortBy,
    });
  };

  // ---------------------------------------
  // Category Change
  // ---------------------------------------
  const handleCategoryChange = (e) => {
    const category = e.target.value;

    updateURL({
      newPage: 1,
      newCategory: category,
      newSearch: searchQuery,
      newSort: sortBy,
    });
  };

  // ---------------------------------------
  // Sort Change
  // ---------------------------------------
  const handleSortChange = (e) => {
    const sort = e.target.value;

    updateURL({
      newPage: 1,
      newSort: sort,
      newSearch: searchQuery,
      newCategory: selectedCategory,
    });
  };

  // ---------------------------------------
  // Items Per Page
  // ---------------------------------------
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);

    updateURL({
      newPage: 1,
      newLimit,
      newSearch: searchQuery,
      newCategory: selectedCategory,
      newSort: sortBy,
    });
  };

  // ---------------------------------------
  // Clear Filters
  // ---------------------------------------
  const handleClearFilters = () => {
    setSearch("");

    updateURL({
      newPage: 1,
      newSearch: "",
      newCategory: "",
      newSort: "",
    });
  };

  // ---------------------------------------
  // Pagination
  // ---------------------------------------
  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (page > 1) {
      updateURL({
        newPage: page - 1,
      });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      updateURL({
        newPage: page + 1,
      });
    }
  };

  const handlePageChange = (newPage) => {
    updateURL({
      newPage,
    });
  };

  // ---------------------------------------
  // Product Details
  // ---------------------------------------
  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  // ---------------------------------------
  // Edit Product
  // ---------------------------------------
  const handleEdit = (e, productId) => {
    e.stopPropagation();

    router.push(`/products/edit/${productId}`);
  };

  // ---------------------------------------
  // Delete Product
  // ---------------------------------------
  const handleDelete = async (e, productId) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(productId);

      // Remove product from UI
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );

      // Update total count
      setTotal((currentTotal) =>
        Math.max(0, currentTotal - 1)
      );

      // Success toaster
      toast.success("Product deleted successfully!");

      // If last product on current page is deleted,
      // go to previous page
      if (products.length === 1 && page > 1) {
        updateURL({
          newPage: page - 1,
        });
      }
    } catch (error) {
      console.error("Delete product error:", error);

      setError("Failed to delete product.");

      // Error toaster
      toast.error("Failed to delete product.");
    }
  };

  // ---------------------------------------
  // Loading State
  // ---------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>

            <div className="h-4 w-72 bg-gray-200 rounded mt-3 animate-pulse"></div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="space-y-4">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                ></div>
              ))}

            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">

      <div className="max-w-7xl mx-auto">

        {/* Page Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Products
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your products, inventory and pricing
            </p>
          </div>

          <button
            onClick={() => router.push("/products/add")}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            <span className="text-lg">
              +
            </span>

            Add Product
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between gap-4">

            <p className="text-sm">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* Filters */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search */}

            <form
              onSubmit={handleSearch}
              className="lg:col-span-2"
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Products
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search product..."
                  className="flex-1 border border-black rounded-lg px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg transition"
                >
                  Search
                </button>

              </div>
            </form>

            {/* Category */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border border-black rounded-lg px-3 py-2.5 bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.slug}
                    value={category.slug}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full border border-black rounded-lg px-3 py-2.5 bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Default
                </option>

                <option value="price-asc">
                  Price: Low to High
                </option>

                <option value="price-desc">
                  Price: High to Low
                </option>

                <option value="rating-desc">
                  Rating: High to Low
                </option>

                <option value="rating-asc">
                  Rating: Low to High
                </option>

                <option value="title-asc">
                  Title: A to Z
                </option>

                <option value="title-desc">
                  Title: Z to A
                </option>
              </select>
            </div>

          </div>

          {/* Clear Filters */}

          {(searchQuery ||
            selectedCategory ||
            sortBy) && (
            <div className="mt-4 pt-4 border-t border-gray-100">

              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>

            </div>
          )}

        </div>

        {/* Desktop Table */}

        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-gray-200">

                <tr>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Image
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Category
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Price
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Rating
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Stock
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {products.length > 0 ? (
                  products.map((product) => (

                    <tr
                      key={product.id}
                      onClick={() =>
                        handleProductClick(product.id)
                      }
                      className="hover:bg-blue-50/40 cursor-pointer transition"
                    >

                      {/* Image */}

                      <td className="px-5 py-4">

                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-14 h-14 object-contain rounded-lg border border-gray-100 bg-gray-50"
                        />

                      </td>

                      {/* Product */}

                      <td className="px-5 py-4">

                        <div className="max-w-xs">

                          <p className="font-semibold text-slate-800 truncate">
                            {product.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: #{product.id}
                          </p>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          {product.category}
                        </span>

                      </td>

                      {/* Price */}

                      <td className="px-5 py-4">

                        <span className="font-semibold text-slate-800">
                          ${product.price}
                        </span>

                      </td>

                      {/* Rating */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          <span className="text-yellow-500">
                            ★
                          </span>

                          <span className="text-sm font-medium text-slate-700">
                            {product.rating}
                          </span>

                        </div>

                      </td>

                      {/* Stock */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={(e) =>
                              handleEdit(
                                e,
                                product.id
                              )
                            }
                            className="px-3 py-1.5 text-xs font-medium text-black border border-blue-200 rounded-md hover:bg-blue-50 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={(e) =>
                              handleDelete(
                                e,
                                product.id
                              )
                            }
                            className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >

                      <div className="text-4xl mb-3">
                        📦
                      </div>

                      <h3 className="font-semibold text-slate-700">
                        No products found
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Mobile Cards */}

        <div className="md:hidden space-y-4">

          {products.length > 0 ? (

            products.map((product) => (

              <div
                key={product.id}
                onClick={() =>
                  handleProductClick(product.id)
                }
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
              >

                <div className="flex gap-4">

                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold text-slate-800 truncate">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      ID: #{product.id}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">

                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                        {product.category}
                      </span>

                      <span className="text-sm font-semibold text-slate-800">
                        ${product.price}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">

                  <div>

                    <p className="text-xs text-slate-400">
                      Rating
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1">
                      ⭐ {product.rating}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Stock
                    </p>

                    <p
                      className={`text-sm font-medium mt-1 ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? product.stock
                        : "Out of stock"}
                    </p>

                  </div>

                </div>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={(e) =>
                      handleEdit(
                        e,
                        product.id
                      )
                    }
                    className="flex-1 px-3 py-2 text-sm font-medium text-black border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) =>
                      handleDelete(
                        e,
                        product.id
                      )
                    }
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

              <div className="text-4xl mb-3">
                📦
              </div>

              <h3 className="font-semibold text-slate-700">
                No products found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your search or filters.
              </p>

            </div>

          )}

        </div>

        {/* Pagination */}

        {totalPages > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Products per page */}

              <div className="flex items-center gap-2">

                <span className="text-sm text-slate-500">
                  Products per page
                </span>

                <select
                  value={limit}
                  onChange={handleLimitChange}
                  className="border border-black rounded-lg px-3 py-2 text-sm bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">
                    10
                  </option>

                  <option value="20">
                    20
                  </option>

                  <option value="50">
                    50
                  </option>
                </select>

              </div>

              {/* Pagination Buttons */}

              <div className="flex items-center justify-between sm:justify-end gap-2">

                <button
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm text-black border border-black rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  )
                    .filter((pageNumber) => {
                      if (totalPages <= 7) {
                        return true;
                      }

                      return (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(
                          pageNumber - page
                        ) <= 1
                      );
                    })
                    .map(
                      (
                        pageNumber,
                        index,
                        array
                      ) => {

                        const previousPage =
                          array[index - 1];

                        const showDots =
                          previousPage &&
                          pageNumber -
                            previousPage >
                            1;

                        return (
                          <div
                            key={pageNumber}
                            className="flex items-center gap-1"
                          >

                            {showDots && (
                              <span className="px-1 text-slate-400">
                                ...
                              </span>
                            )}

                            <button
                              onClick={() =>
                                handlePageChange(
                                  pageNumber
                                )
                              }
                              className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition ${
                                page === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "border border-black text-black hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>

                          </div>
                        );
                      }
                    )}

                </div>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm text-black border border-black rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}