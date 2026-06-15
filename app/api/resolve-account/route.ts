// app/api/resolve-account/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const account_number = searchParams.get('account_number');
  const bank_code      = searchParams.get('bank_code');

  if (!account_number || !bank_code) {
    return NextResponse.json(
      { error: 'account_number and bank_code are required' },
      { status: 400 }
    );
  }

  // 10 digits for NUBAN bank accounts, 11 digits for PalmPay/OPay phone numbers
  if (!/^\d{10}$/.test(account_number)) {
    return NextResponse.json(
      { error: 'account_number must be 10  digits' },
      { status: 400 }
    );
  }

  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET) {
    return NextResponse.json(
      { error: 'Paystack secret key not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Cache-Control': 'no-store',
      },
      next: { revalidate: 60 },
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message ?? 'Could not resolve account' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      account_name:   data.data.account_name,
      account_number: data.data.account_number,
    });

  } catch (err) {
    console.error('[resolve-account] Paystack fetch error:', err);
    return NextResponse.json(
      { error: 'Network error while contacting Paystack' },
      { status: 502 }
    );
  }
}