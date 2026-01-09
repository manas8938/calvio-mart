// src/screens/admin/ProductsList.jsx - NO BLINKING + FIXED IMAGES
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/api';
import { normalizeImageUrl } from '../../utils/imageHelper';
import toast from 'react-hot-toast';
import { Trash2, Edit, Plus, Loader } from 'lucide-react';

export default function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await getProducts(1, 100);
        const productsData = res.data?.items || res.data || [];
        if (isMounted) {
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (isMounted) {
          toast.error('Failed to load products');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleting(id);
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully!');
      // Update state directly - NO REFETCH (prevents blinking)
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-indigo-600" size={48} />
          <span className="ml-4 text-xl text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first product</p>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Image</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Stock</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">
                      <img
                        src={normalizeImageUrl(product.image)}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                        }}
                        loading="lazy"
                      />
                    </td>
                    <td className="px-8 py-4 font-medium text-gray-900">{product.title}</td>
                    <td className="px-8 py-4 text-gray-700">{product.category || 'N/A'}</td>
                    <td className="px-8 py-4 font-semibold text-gray-900">${Number(product.price).toFixed(2)}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === product.id ? (
                            <Loader size={20} className="animate-spin" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}