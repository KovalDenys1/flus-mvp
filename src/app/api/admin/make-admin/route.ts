import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Update user role to admin
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', email.toLowerCase())
      .select('id, email, role, navn')
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({
        error: 'Failed to update user role',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${data.navn || data.email} is now an admin`,
      user: data
    });

  } catch (error) {
    console.error('Exception updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}