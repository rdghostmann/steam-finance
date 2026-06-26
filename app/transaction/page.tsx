'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Copy, Check, Headphones, ChevronRight,
  CheckCircle2, Clock, XCircle, AlertTriangle, FileText
} from 'lucide-react';
import { Transaction } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// ─── Bank / App logo pill ─────────────────────────────────────────────────────

function AppLogoPill({ bank }: { bank?: string }) {
  const label = bank ?? 'NairaPay';

  // Color map for common Nigerian banks/apps
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    OPay:        { bg: '#1a1a2e', text: '#fff',     dot: '#00C851' },
    PalmPay:     { bg: '#1a1a2e', text: '#fff',     dot: '#7C3AED' },
    Kuda:        { bg: '#1a1a2e', text: '#fff',     dot: '#FF4B00' },
    Moniepoint:  { bg: '#1a1a2e', text: '#fff',     dot: '#0057FF' },
    'Access Bank': { bg: '#1a1a2e', text: '#fff',   dot: '#E87722' },
    NairaPay:    { bg: '#1a1a2e', text: '#fff',     dot: '#7C3AED' },
  };

  const c = colors[label] ?? { bg: '#1a1a2e', text: '#fff', dot: '#7C3AED' };

  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/10"
      style={{ backgroundColor: c.bg }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.dot }} />
        <span className="text-[9px] font-black tracking-tighter" style={{ color: c.text }}>
          {label.slice(0, 4).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map = {
    Successful: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', label: 'Successful' },
    Pending:    { icon: <Clock className="w-4 h-4" />,        color: 'text-amber-400',   label: 'Pending' },
    Failed:     { icon: <XCircle className="w-4 h-4" />,      color: 'text-red-400',     label: 'Failed' },
  };
  const s = map[status as keyof typeof map] ?? map.Successful;
  return (
    <div className={`flex items-center justify-center gap-1.5 ${s.color}`}>
      {s.icon}
      <span className="text-sm font-bold">{s.label}</span>
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function Row({
  label, value, valueClass = '', mono = false, copyable = false
}: {
  label: string;
  value: string;
  valueClass?: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
      <span className="text-[13px] text-slate-400 font-medium shrink-0">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className={`text-[13px] font-semibold text-white break-all text-right ${mono ? 'font-mono' : ''} ${valueClass}`}>
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5 text-slate-400" />
            }
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#1C1830] border border-white/5 px-5 overflow-hidden">
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TransactionDetailPage() {
  const router = useRouter();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('np_selected_transaction');
    if (raw) {
      try { setTx(JSON.parse(raw)); } catch { /* malformed */ }
    }
  }, []);

  if (!mounted) return null;

  if (!tx) {
    return (
      <div className="min-h-screen bg-[#13111F] flex flex-col items-center justify-center gap-4 p-6">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-white font-semibold text-sm">Transaction not found.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#7C3AED] text-white text-sm font-bold rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isCredit = ['deposit', 'interest', 'commission'].includes(tx.type);
  const fee = tx.fee ?? 0;
  const paymentAmount = tx.amount; // already deducted on credit; total paid on debit

  const typeLabel: Record<string, string> = {
    deposit:    'Wallet Funding',
    transfer:   'Money Transfer - MMO',
    airtime:    'Airtime Recharge',
    data:       'Data Bundle',
    service:    'Utility Payment',
    interest:   'Interest Payout',
    commission: 'Commission Reward',
  };

  return (
    <div className="min-h-screen bg-[#13111F] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Transaction Details
        </button>
        <button className="p-2 rounded-full bg-white/5">
          <Headphones className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-3">

        {/* Hero card */}
        <Card>
          <div className="py-6 text-center">
            <AppLogoPill bank={tx.recipientBank ?? (isCredit ? 'NairaPay' : undefined)} />

            {tx.recipientName && (
              <p className="text-white font-extrabold text-sm uppercase tracking-wide mb-1">
                To {tx.recipientName}
              </p>
            )}

            <p className="text-white font-extrabold text-[38px] leading-tight tracking-tight">
              ₦ {formatCurrency(tx.amount)}
            </p>

            <div className="mt-2">
              <StatusBadge status={tx.status} />
            </div>

            {/* Fast Transfer Safeguard pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-4 h-4 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Fast Transfer Safeguard</span>
              <span className="text-[11px] font-bold text-[#7C3AED]">Completed</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </Card>

        {/* Amount breakdown */}
        <Card>
          <Row label="Transfer Amount"   value={`₦ ${formatCurrency(tx.amount)}`} />
          <Row
            label="Fee"
            value={fee === 0 ? `₦ 0.00` : `₦ ${formatCurrency(fee)}`}
            valueClass={fee === 0 ? 'text-emerald-400' : ''}
          />
          <Row label="Payment Amount"    value={`₦ ${formatCurrency(paymentAmount + fee)}`} />
        </Card>

        {/* Recipient + Session ID */}
        <Card>
          {tx.recipientName && (
            <div className="flex items-start justify-between gap-4 py-3.5 border-b border-white/5">
              <span className="text-[13px] text-slate-400 font-medium shrink-0">Recipient</span>
              <div className="text-right">
                <p className="text-[13px] font-bold text-white uppercase">{tx.recipientName}</p>
                {tx.recipientBank && tx.recipientAccount && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {tx.recipientBank} | {tx.recipientAccount}
                  </p>
                )}
              </div>
            </div>
          )}

          {tx.sessionId && (
            <Row label="Session ID" value={tx.sessionId} mono copyable />
          )}
        </Card>

        {/* Session ID notice (only for transfers) */}
        {tx.type === 'transfer' && tx.sessionId && (
          <div className="rounded-2xl bg-[#1C1830] border border-white/5 px-5 py-4">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              If the recipient account is not credited within 5 minutes, please use the Session ID to{' '}
              <span className="text-[#7C3AED] font-semibold">contact the recipient bank.</span>
            </p>
          </div>
        )}

        {/* Transaction metadata */}
        <Card>
          <Row label="Completion Time"  value={tx.date} />
          <Row
            label="Transaction ID"
            value={tx.transactionId ?? tx.reference}
            mono copyable
          />
          <Row label="Application"      value="NairaPay" />
          <Row
            label="Payment Type"
            value={tx.paymentType ?? typeLabel[tx.type] ?? tx.type}
          />
          {tx.paymentMethod && (
            <Row label="Payment Method" value={tx.paymentMethod} />
          )}
        </Card>

      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#13111F] border-t border-white/5 px-5 py-5">
        <p className="text-center text-[11px] text-slate-500 font-semibold mb-4">
          Any Questions about this transaction?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/receipt')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1C1830] border border-white/10 text-[#7C3AED] text-sm font-bold hover:bg-white/5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Receipt
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1C1830] border border-white/10 text-[#7C3AED] text-sm font-bold hover:bg-white/5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Report a Dispute
          </button>
        </div>
      </div>

    </div>
  );
}