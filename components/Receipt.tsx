'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { ReceiptData } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NairaPayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="#7C3AED" />
      <path d="M20 13L26 17L20 21L14 17L20 13Z" fill="white" />
      <path d="M14 17L20 21V27L14 23V17Z" fill="white" opacity="0.6" />
      <path d="M26 17L20 21V27L26 23V17Z" fill="white" opacity="0.4" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100" />
      <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100" />
      <div
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #D1D5DB 0, #D1D5DB 6px, transparent 6px, transparent 12px)',
          height: '1.5px',
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-[13px] font-semibold text-gray-400 shrink-0">{label}</p>
      <p className="text-[13px] font-bold text-[#2A245A] text-right break-all">{value}</p>
    </div>
  );
}

function PerforatedEdge({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div
      className="flex justify-between px-1 bg-white"
      style={{ height: '13px', overflow: 'hidden' }}
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-full bg-gray-100"
          style={{
            width: '18px',
            height: '18px',
            border: '1px solid #E5E7EB',
            marginTop: position === 'top' ? '-9px' : undefined,
            marginBottom: position === 'bottom' ? '-9px' : undefined,
          }}
        />
      ))}
    </div>
  );
}

function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {Array.from({ length: 6 }).map((_, row) =>
        [0, 1].map((col) => (
          <div
            key={`${row}-${col}`}
            className="absolute flex flex-col items-center gap-0.5"
            style={{
              top: `${row * 120 + (col === 1 ? 60 : 0)}px`,
              left: col === 0 ? '8%' : '55%',
              transform: 'rotate(-30deg)',
              opacity: 0.06,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="#7C3AED" />
              <path d="M20 13L26 17L20 21L14 17L20 13Z" fill="white" />
            </svg>
            <span
              className="text-[10px] font-extrabold text-[#7C3AED] tracking-widest"
              style={{ fontStyle: 'italic' }}
            >
              palmpay
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Image capture util ───────────────────────────────────────────────────────

async function captureReceiptAsBlob(el: HTMLElement): Promise<Blob> {
  // Dynamically import so it never runs on the server
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(el, {
    backgroundColor: '#F3F4F6', // same as page bg so no transparent fringe
    scale: 3,                   // 3× for sharp mobile screenshots
    useCORS: true,
    logging: false,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob returned null'));
    }, 'image/png');
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReceiptPage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('np_last_receipt');
    if (raw) {
      try { setReceipt(JSON.parse(raw)); } catch { /* malformed */ }
    }
  }, []);

  if (!mounted) return null;

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-500 font-semibold text-sm">No receipt found.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-[#7C3AED] text-white text-sm font-bold rounded-full"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ── Share as image ──────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (!receiptRef.current || isCapturing) return;
    setIsCapturing(true);

    try {
      const blob = await captureReceiptAsBlob(receiptRef.current);
      const file = new File([blob], 'palmpay-receipt.png', { type: 'image/png' });

      // Web Share API level 2 — can share files (supported on Android Chrome & iOS Safari)
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: 'PalmPay Receipt',
            text: `₦${formatAmount(receipt.amount)} sent to ${receipt.recipientName}`,
            files: [file],
          });
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') return; // user cancelled
          // share failed for another reason — fall through to download
          triggerDownload(blob);
        }
      } else {
        // Desktop or browser without file-share support → download the PNG
        triggerDownload(blob);
      }
    } catch (err) {
      console.error('Receipt capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  // ── Download as image ───────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!receiptRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const blob = await captureReceiptAsBlob(receiptRef.current);
      triggerDownload(blob);
    } catch (err) {
      console.error('Receipt download failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PalmPay-receipt-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">

      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-5">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#2A245A] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>

        <div className="flex gap-2">
          {/* Download button — always visible */}
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#2A245A] shadow-sm hover:shadow transition-shadow disabled:opacity-50"
          >
            {isCapturing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Save
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7C3AED] text-white text-xs font-bold shadow-sm hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
          >
            {isCapturing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            Share
          </button>
        </div>
      </div>

      {/* ── Receipt card (this is what gets captured) ── */}
      <div
        ref={receiptRef}
        className="w-full max-w-md bg-white rounded-[28px] shadow-xl overflow-hidden relative"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      >
        <PerforatedEdge position="top" />

        <div className="relative px-7 pt-5 pb-7">
          <Watermark />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6">
              <NairaPayIcon />
              <span className="text-[24px] font-extrabold text-gray-900 tracking-tight">
               PalmPay
              </span>
            </div>

            {/* Amount + status */}
            <div className="text-center">
              <p className="text-[42px] font-extrabold leading-tight" style={{ color: '#7C3AED' }}>
                ₦ {formatAmount(receipt.amount)}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <p className="text-[18px] font-extrabold" style={{ color: '#2A245A' }}>
                  Successful Transaction
                </p>
              </div>
              <p className="text-[13px] font-semibold text-gray-400 mt-1">
                {formatTimestamp(receipt.timestamp)}
              </p>
            </div>

            <Divider />

            {/* Recipient */}
            <div className="grid grid-cols-2 gap-3 items-start">
              <p className="text-[19px] font-extrabold" style={{ color: '#2A245A' }}>Recipient:</p>
              <div className="text-right">
                <p className="text-[14px] font-extrabold uppercase leading-snug" style={{ color: '#2A245A' }}>
                  {receipt.recipientName}
                </p>
                <p className="text-[12px] font-bold text-gray-400 mt-2">
                  {receipt.recipientBank} | {receipt.recipientAccount}
                </p>
              </div>
            </div>

            <Divider />

            {/* Sender */}
            <div className="grid grid-cols-2 gap-3 items-start">
              <p className="text-[19px] font-extrabold" style={{ color: '#2A245A' }}>Sender:</p>
              <div className="text-right">
                <p className="text-[14px] font-extrabold uppercase leading-snug" style={{ color: '#2A245A' }}>
                  {receipt.senderName}
                </p>
                <p className="text-[12px] font-bold text-gray-400 mt-2">
                  {receipt.senderBank} | {receipt.senderAccount}
                </p>
              </div>
            </div>

            <Divider />

            {/* Transaction Info */}
            <div>
              <h3 className="text-[19px] font-extrabold mb-4" style={{ color: '#2A245A' }}>
                Transaction Info:
              </h3>
              <div className="space-y-3.5">
                <InfoRow label="Transaction Type" value={receipt.transactionType} />
                <InfoRow label="Transaction ID"   value={receipt.transactionId} />
                <InfoRow label="Session ID"        value={receipt.sessionId} />
                {receipt.remark && <InfoRow label="Remark" value={receipt.remark} />}
              </div>
            </div>

            <Divider />

            <p className="text-[12px] font-semibold text-gray-400 text-center leading-snug">
              Enjoy Seamless and Unlimited Free Transfers to All Banks.
            </p>

          </div>
        </div>

        <PerforatedEdge position="bottom" />
      </div>

      {/* Back CTA */}
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-full shadow-lg shadow-[#7C3AED]/30 transition-all active:scale-95"
      >
        Back to Dashboard
      </button>

    </div>
  );
}