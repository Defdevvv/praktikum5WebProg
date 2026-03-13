'use client';

import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';

export default function Home() {

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <Container className="py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">AdminPanel</div>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link href="/users" className="text-gray-700 hover:text-blue-600 transition">
                Users
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
                Products
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main>
        <Container className="py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage users, products, and orders with a clean, modern interface built with Next.js and MySQL.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">1.2K</div>
              <p className="text-gray-600">Active Users</p>
            </Card>
            <Card className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">856</div>
              <p className="text-gray-600">Products</p>
            </Card>
            <Card className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">$42.5K</div>
              <p className="text-gray-600">Total Revenue</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-3">
                <Link href="/users/new">
                  <Button className="w-full text-left">Add New User</Button>
                </Link>
                <Link href="/products/new">
                  <Button variant="secondary" className="w-full text-left">Add New Product</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="secondary" className="w-full text-left">View Dashboard</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Container>
      </main>

      <footer className="bg-gray-900 text-gray-400 mt-20">
        <Container className="py-12">
          <div className="flex justify-between items-center">
            <p>2026 AdminPanel. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
