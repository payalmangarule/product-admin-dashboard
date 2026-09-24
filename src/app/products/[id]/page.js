"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getProductById,
  deleteProduct,
} from "../../../services/productService";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(params.id);

        setProduct(data);
      } catch (error) {
        console.error("Get product error:", error);

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Delete Product
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteProduct(params.id);

      // Success Toast
      toast.success("Product deleted successfully!");

      // Redirect after toast
      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (error) {
      console.error("Delete product error:", error);

      // Error Toast
      toast.error("Failed to delete product.");

      setDeleting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-black text-lg">
          Loading product...
        </p>
      </main>
    );
  }

  // Product Not Found
  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">

          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>

          <p className="text-black mb-6">
            {error || "Unable to find this product."}
          </p>

          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.push("/products")}
          className="mb-6 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">

          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Product Image */}
            <div className="flex items-center justify-center">

              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full max-w-md h-96 object-contain rounded-lg"
              />

            </div>

            {/* Product Information */}
            <div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.title}
              </h1>

              <p className="text-gray-600 leading-7 mb-6">
                {product.description}
              </p>

              {/* Price */}
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ${product.price}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">

                <span className="text-yellow-500 text-xl">
                  ⭐
                </span>

                <span className="text-gray-700">
                  {product.rating}
                </span>

              </div>

              {/* Product Details */}
              <div className="space-y-3 text-gray-700 mb-6">

                <p>
                  <span className="font-semibold">
                    Brand:
                  </span>{" "}
                  {product.brand || "N/A"}
                </p>

                <p>
                  <span className="font-semibold">
                    Stock:
                  </span>{" "}
                  {product.stock}
                </p>

                <p>
                  <span className="font-semibold">
                    Discount:
                  </span>{" "}
                  {product.discountPercentage}%
                </p>

                <p>
                  <span className="font-semibold">
                    SKU:
                  </span>{" "}
                  {product.sku || "N/A"}
                </p>

                <p>
                  <span className="font-semibold">
                    Category:
                  </span>{" "}
                  {product.category}
                </p>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">

                {/* Edit Button */}
                <button
                  onClick={() =>
                    router.push(`/products/edit/${product.id}`)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit Product
                </button>

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Product"}
                </button>

              </div>

            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-black mb-5">
              Reviews
            </h2>

            {product.reviews &&
            product.reviews.length > 0 ? (

              <div className="space-y-4">

                {product.reviews.map((review, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >

                    <div className="flex items-center justify-between mb-2">

                      <h3 className="font-semibold text-gray-800">
                        {review.reviewerName}
                      </h3>

                      <span className="text-yellow-500">
                        ⭐ {review.rating}
                      </span>

                    </div>

                    <p className="text-black mb-2">
                      {review.comment}
                    </p>

                    <p className="text-sm text-black">
                      {review.date}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-gray-500">
                No reviews available.
              </p>

            )}

          </div>

        </div>
      </div>

    </main>
  );
}