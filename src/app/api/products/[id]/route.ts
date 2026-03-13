import { NextRequest, NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '@/lib/db';

interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query<Product[]>(
      'SELECT * FROM Product WHERE id = ?',
      [productId]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[API] Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { name, description, price, stock, image } = await request.json();

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'UPDATE Product SET name = ?, description = ?, price = ?, stock = ?, image = ?, updatedAt = NOW() WHERE id = ?',
      [name, description, parseFloat(price), parseInt(stock), image || null, productId]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const [rows] = await connection.query<Product[]>(
      'SELECT * FROM Product WHERE id = ?',
      [productId]
    );
    connection.release();

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[API] Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM Product WHERE id = ?',
      [productId]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: String(error) },
      { status: 500 }
    );
  }
}
