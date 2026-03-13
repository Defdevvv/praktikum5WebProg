'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import Modal from '@/components/Modal';
import AddUserForm from '@/components/AddUserForm';
import { AlertContainer, AlertNotification } from '@/components/Alert';
import { useAlert } from '@/hooks/useAlert';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifications, addAlert, removeAlert } = useAlert();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus user ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghapus user');
      }

      setUsers(users.filter((u) => u.id !== id));
      addAlert('User berhasil dihapus', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kesalahan saat menghapus user';
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
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <Button onClick={() => setIsModalOpen(true)}>Tambah User Baru</Button>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Daftar User</h2>
            </CardHeader>
            <CardBody>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Error: {error}
                </div>
              )}
              {loading ? (
                <p className="text-gray-600">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-600">Tidak ada user. <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline">Buat yang baru?</button></p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-700 transition"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </main>

      <Modal
        isOpen={isModalOpen}
        title="Tambah User Baru"
        onClose={() => setIsModalOpen(false)}
      >
        <AddUserForm
          onSuccess={(user) => {
            setUsers([user, ...users]);
            setIsModalOpen(false);
            addAlert('User berhasil ditambahkan', 'success');
          }}
          onError={(message) => addAlert(message, 'error')}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
