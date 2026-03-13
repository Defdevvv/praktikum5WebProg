'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import Modal from '@/components/Modal';
import AddProductForm from '@/components/AddProductForm';
import EditProductForm from '@/components/EditProductForm';
import { AlertContainer } from '@/components/Alert';
import { useAlert } from '@/hooks/useAlert';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { notifications, addAlert, removeAlert } = useAlert();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus produk ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghapus produk');
      }

      setProducts(products.filter((p) => p.id !== id));
      addAlert('Produk berhasil dihapus', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kesalahan saat menghapus produk';
      addAlert(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertContainer notifications={notifications} onClose={removeAlert} />
      
      <header className="bg-white shadow-sm">
        <Container className="py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              AdminPanel
            </Link>
            <Link href="/">
              <Button variant="secondary">Kembali ke Home</Button>
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
            <Button onClick={() => setIsModalOpen(true)}>Tambah Produk Baru</Button>
          </div>

          {loading ? (
            <p className="text-gray-600">Memuat produk...</p>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Error: {error}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-600">Tidak ada produk. <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline">Buat yang baru?</button></p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id}>
                  {product.image && (
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  )}
                  <CardBody>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-600">Stok: {product.stock}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Modal
        isOpen={isModalOpen}
        title="Tambah Produk Baru"
        onClose={() => setIsModalOpen(false)}
      >
        <AddProductForm
          onSuccess={(product) => {
            setProducts([product, ...products]);
            setIsModalOpen(false);
            addAlert('Produk berhasil ditambahkan', 'success');
          }}
          onError={(message) => addAlert(message, 'error')}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {editingProduct && (
        <Modal
          isOpen={isEditModalOpen}
          title="Edit Produk"
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
        >
          <EditProductForm
            product={editingProduct}
            onSuccess={(updatedProduct) => {
              setProducts(products.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
              setIsEditModalOpen(false);
              setEditingProduct(null);
              addAlert('Produk berhasil diupdate', 'success');
            }}
            onError={(message) => addAlert(message, 'error')}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
