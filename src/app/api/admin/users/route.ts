import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

function generateUniquePassword(): string {
  const base = Math.random().toString(36).slice(2, 8);
  const suffix = Math.floor(100 + Math.random() * 900).toString();
  return `${base}${suffix}`; // 6 letters + 3 digits
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, role, email, phoneNumber, password } = await request.json();

    if (!name || !role) {
      return NextResponse.json({ error: 'name and role are required' }, { status: 400 });
    }

    if (!email && !phoneNumber) {
      return NextResponse.json({ error: 'Either email or phoneNumber must be provided' }, { status: 400 });
    }

    const validRoles = ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const normalizedPhone = phoneNumber ? String(phoneNumber).replace(/[^\d]/g, '') : undefined;
    if (normalizedPhone && (normalizedPhone.length < 7 || normalizedPhone.length > 15)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Duplicate checks
    const existing = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(normalizedPhone ? [{ phoneNumber: normalizedPhone }] : []),
      ],
    });
    if (existing) {
      return NextResponse.json({ error: 'User with this email or phone already exists' }, { status: 409 });
    }

    const chosenPassword = password && String(password).length >= 6 ? String(password) : generateUniquePassword();
    const hashed = await bcrypt.hash(chosenPassword, 12);

    const user = new User({
      name: name.trim(),
      role,
      email: email ? String(email).toLowerCase().trim() : undefined,
      phoneNumber: normalizedPhone,
      password: hashed,
      isActive: true,
    });
    await user.save();

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      defaultPassword: password ? undefined : chosenPassword,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}


