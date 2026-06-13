// app/api/resolve-account/route.ts
// Proxies Paystack's "Resolve Account Number" endpoint server-side
// so the secret key is never exposed to the browser.
//
// Usage: GET /api/resolve-account?account_number=0123456789&bank_code=044

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const account_number = searchParams.get('account_number');
  const bank_code      = searchParams.get('bank_code');

  // ── Basic validation ────────────────────────────────────────────────────────
  if (!account_number || !bank_code) {
    return NextResponse.json(
      { error: 'account_number and bank_code are required' },
      { status: 400 }
    );
  }

  if (!/^\d{10}$/.test(account_number)) {
    return NextResponse.json(
      { error: 'account_number must be exactly 10 digits' },
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

  // ── Call Paystack ───────────────────────────────────────────────────────────
  try {
    const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Cache-Control': 'no-store', // always live data
      },
      // Next.js fetch cache — revalidate every 60s
      // (same account/bank combo rarely changes)
      next: { revalidate: 60 },
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      // Paystack returned an error (e.g. account not found)
      return NextResponse.json(
        { error: data.message ?? 'Could not resolve account' },
        { status: res.status }
      );
    }

    // ── Return just what the client needs ─────────────────────────────────────
    return NextResponse.json({
      account_name:   data.data.account_name,   // e.g. "JOHN DOE"
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