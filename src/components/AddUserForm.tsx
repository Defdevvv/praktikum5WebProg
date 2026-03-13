'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/Button';

interface AddUserFormProps {
  onSuccess: (user: any) => void;
  onError: (message: string) => void;
  onClose: () => void;
}

export default function AddUserForm({
  onSuccess,
  onError,
  onClose,
}: AddUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.name) {
      onError('Email dan nama harus diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || 'Gagal menambah user');
        return;
      }

      onSuccess(data);
      setFormData({ email: '', name: '', role: 'user' });
    } catch (error) {
      onError('Kesalahan saat menambah user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama lengkap"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Tambah User'}
        </Button>
      </div>
    </form>
  );
}
