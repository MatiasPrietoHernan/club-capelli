import User from '@/schemas/user.schema'
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/database';
import { NextResponse } from 'next/server';


export async function POST(request: Request) { // Handle user registration
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }
    const pepper = process.env.PASSWORD_PEPPER ?? "";
    const passwordHash = await bcrypt.hash(password + pepper, 12);
    const newUser = new User({ email, passwordHash, name });
    console.log(newUser)
    await newUser.save();

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}