'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/Button';

interface AddProductFormProps {
  onSuccess: (product: any) => void;
  onError: (message: string) => void;
  onClose: () => void;
}

export default function AddProductForm({
  onSuccess,
  onError,
  onClose,
}: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || formData.stock === '') {
      onError('Nama, deskripsi, harga, dan stok harus diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || 'Gagal menambah produk');
        return;
      }

      onSuccess(data);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: '',
      });
    } catch (error) {
      onError('Kesalahan saat menambah produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama produk"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Deskripsi produk"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Gambar
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Tambah Produk'}
        </Button>
      </div>
    </form>
  );
}
