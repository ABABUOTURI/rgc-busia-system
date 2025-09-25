import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phoneNumber, role, otp } = await req.json();

    if (!phoneNumber || !role || !otp) {
      return NextResponse.json({ error: 'phoneNumber, role, and otp are required' }, { status: 400 });
    }

    const normalizedPhone = String(phoneNumber).replace(/[^\d]/g, '');

    const user = await User.findOne({ phoneNumber: normalizedPhone, role, isActive: true });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return NextResponse.json({ error: 'No active OTP. Request a new one.' }, { status: 400 });
    }

    if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP expired. Request a new one.' }, { status: 400 });
    }

    if (user.otpAttempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts. Request a new OTP.' }, { status: 429 });
    }

    // Increment attempts regardless
    user.otpAttempts += 1;

    if (String(user.otpCode) !== String(otp)) {
      await user.save();
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Success: clear OTP fields
    user.otpCode = null as unknown as string;
    user.otpExpiresAt = null as unknown as Date;
    user.otpAttempts = 0;
    user.loginMethod = 'otp';
    await user.save();

    const token = signToken({ userId: user._id, role: user.role });
    const res = NextResponse.json({ token, role: user.role, name: user.name });
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'OTP verification failed' }, { status: 500 });
  }
}


