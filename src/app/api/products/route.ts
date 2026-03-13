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

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM Product ORDER BY createdAt DESC'
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image } = body;

    if (!name || !description || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Name, description, price, and stock are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO Product (name, description, price, stock, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, description, parseFloat(price), parseInt(stock), image || null]
    );
    
    const [product] = await connection.query<Product[]>(
      'SELECT * FROM Product WHERE id = ?',
      [result.insertId]
    );
    connection.release();

    return NextResponse.json(product[0], { status: 201 });
  } catch (error) {
    console.error('[API] Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: String(error) },
      { status: 500 }
    );
  }
}
