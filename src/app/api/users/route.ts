import { NextRequest, NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '@/lib/db';

interface User extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM User ORDER BY createdAt DESC'
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[API] Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role = 'user' } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO User (email, name, role, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [email, name, role]
    );
    
    const [user] = await connection.query<User[]>(
      'SELECT * FROM User WHERE id = ?',
      [result.insertId]
    );
    connection.release();

    return NextResponse.json(user[0], { status: 201 });
  } catch (error) {
    console.error('[API] Error creating user:', error);
    if (String(error).includes('Duplicate')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user', details: String(error) },
      { status: 500 }
    );
  }
}
