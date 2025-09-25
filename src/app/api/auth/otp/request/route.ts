import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/mail';
import { sendOtpSms, toE164 } from '@/lib/sms';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phoneNumber, role } = await req.json();

    if (!phoneNumber || !role) {
      return NextResponse.json({ error: 'phoneNumber and role are required' }, { status: 400 });
    }

    const normalizedPhone = String(phoneNumber).replace(/[^\d]/g, '');
    if (normalizedPhone.length < 7 || normalizedPhone.length > 15) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    const user = await User.findOne({ phoneNumber: normalizedPhone, role, isActive: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found for provided phone and role' }, { status: 404 });
    }

    const otpCode = generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpCode = otpCode;
    user.otpExpiresAt = expires;
    user.otpAttempts = 0;
    await user.save();

    // Send SMS via Africa's Talking (or log in dev)
    try {
      const e164 = toE164(normalizedPhone);
      await sendOtpSms(e164, otpCode);
    } catch (e) {
      console.warn('Failed to send OTP SMS:', e);
    }

    // Send to email as well if available
    if (user.email) {
      try {
        await sendOtpEmail(user.email, otpCode);
      } catch (e) {
        console.warn('Failed to send OTP email:', e);
      }
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}


