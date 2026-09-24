"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "../../../services/productService";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !title ||
      !price ||
      !category ||
      !description ||
      !image
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        title,
        price: Number(price),
        category,
        description,
        images: [image],
        thumbnail: image,
      };

      const data = await addProduct(productData);

      console.log("Product added:", data);

      setSuccess("Product added successfully!");

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (error) {
      console.error("Add product error:", error);

      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Add Product
          </h1>

          <button
            onClick={() => router.push("/products")}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            Back to Products
          </button>

        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>

              <input
                type="text"
                placeholder="Enter product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>

              <input
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <input
                type="text"
                placeholder="Enter product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>

              <input
                type="url"
                placeholder="https://example.com/product-image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Image Preview */}
            {image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </p>

                <img
                  src={image}
                  alt="Product preview"
                  className="w-40 h-40 object-cover rounded-md border"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="text-green-600 text-sm">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}