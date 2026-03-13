'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardBody, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError('Name, description, price, and stock are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Container className="py-6">
          <Link href="/products" className="text-2xl font-bold text-blue-600">
            AdminPanel
          </Link>
        </Container>
      </header>

      <main className="py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

          <Card className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <CardBody>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex gap-3 justify-end">
                  <Link href="/products">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </Container>
      </main>
    </div>
  );
}
