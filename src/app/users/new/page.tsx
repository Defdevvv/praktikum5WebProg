'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardBody, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      router.push('/users');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Container className="py-6">
          <Link href="/users" className="text-2xl font-bold text-blue-600">
            AdminPanel
          </Link>
        </Container>
      </header>

      <main className="py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New User</h1>

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
                    <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                      placeholder="Enter user name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                      placeholder="Enter user email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex gap-3 justify-end">
                  <Link href="/users">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
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
