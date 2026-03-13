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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query<User[]>(
      'SELECT * FROM User WHERE id = ?',
      [userId]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[API] Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: String(error) },
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
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { email, name, role } = await request.json();

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'UPDATE User SET email = ?, name = ?, role = ?, updatedAt = NOW() WHERE id = ?',
      [email, name, role, userId]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [rows] = await connection.query<User[]>(
      'SELECT * FROM User WHERE id = ?',
      [userId]
    );
    connection.release();

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[API] Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
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
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM User WHERE id = ?',
      [userId]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: String(error) },
      { status: 500 }
    );
  }
}
