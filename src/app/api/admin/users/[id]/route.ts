import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { Types } from 'mongoose'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 })
    }

    const { name, role, email, phoneNumber } = await request.json()

    if (!name || !role) {
      return NextResponse.json({ error: 'name and role are required' }, { status: 400 })
    }

    const validRoles = ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const normalizedPhone = phoneNumber ? String(phoneNumber).replace(/[^\d]/g, '') : undefined
    if (normalizedPhone && (normalizedPhone.length < 7 || normalizedPhone.length > 15)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    // Check duplicates (excluding current user)
    if (email || normalizedPhone) {
      const dup = await User.findOne({
        _id: { $ne: id },
        $or: [
          ...(email ? [{ email: String(email).toLowerCase() }] : []),
          ...(normalizedPhone ? [{ phoneNumber: normalizedPhone }] : []),
        ],
      })
      if (dup) {
        return NextResponse.json({ error: 'Email or phone already in use' }, { status: 409 })
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: String(name).trim(),
          role,
          email: email ? String(email).toLowerCase().trim() : undefined,
          phoneNumber: normalizedPhone,
        },
      },
      { new: true, projection: { password: 0 } }
    ).lean()

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        role: updated.role,
        email: updated.email,
        phoneNumber: updated.phoneNumber,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 })
    }

    const res = await User.findByIdAndDelete(id)
    if (!res) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 })
  }
}
