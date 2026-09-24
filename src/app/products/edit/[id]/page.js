"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "../../../../services/productService";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!params?.id) {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);

        const product = await getProductById(params.id);

        setTitle(product.title || "");
        setPrice(product.price || "");
        setCategory(product.category || "");
        setDescription(product.description || "");
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title || !price || !category || !description) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);

      await updateProduct(params.id, {
        title: title,
        price: Number(price),
        category: category,
        description: description,
      });

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (error) {
      console.error("Failed to update product:", error);
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading product...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Product
          </h1>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            Back to Products
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows="5"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-600 text-sm">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? "Updating Product..." : "Update Product"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}