'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardBody } from '@/components/Card';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1200,
    totalProducts: 856,
    totalOrders: 342,
    totalRevenue: 42500,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await fetch('/api/users');
        const productsRes = await fetch('/api/products');
        const users = await usersRes.json();
        const products = await productsRes.json();

        setStats({
          totalUsers: users.length || 0,
          totalProducts: products.length || 0,
          totalOrders: 342,
          totalRevenue: 42500,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Container className="py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              AdminPanel
            </Link>
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Back to Home
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-gray-600 mt-2">Total Users</p>
              <p className="text-sm text-gray-500 mt-4">Active accounts in system</p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProducts}</div>
              <p className="text-gray-600 mt-2">Products</p>
              <p className="text-sm text-gray-500 mt-4">Items in inventory</p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalOrders}</div>
              <p className="text-gray-600 mt-2">Orders</p>
              <p className="text-sm text-gray-500 mt-4">Total transactions</p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-gray-600 mt-2">Revenue</p>
              <p className="text-sm text-gray-500 mt-4">Total earnings</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/users"
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <h3 className="font-semibold text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600 mt-1">View and manage all users</p>
                </Link>

                <Link
                  href="/products"
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600 mt-1">View and manage all products</p>
                </Link>

                <a
                  href="#"
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <h3 className="font-semibold text-gray-900">View Orders</h3>
                  <p className="text-sm text-gray-600 mt-1">View all orders and transactions</p>
                </a>
              </div>
            </CardBody>
          </Card>
        </Container>
      </main>
    </div>
  );
}
