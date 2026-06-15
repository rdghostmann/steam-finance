'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  X, Landmark, Send, UserCheck, AlertCircle, ArrowRight, BadgeCheck,
} from 'lucide-react';
import { ReceiptData } from '@/types';

interface Bank {
  name: string;
  code: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onTransferSuccess: (amount: number, description: string, isPalmPay: boolean) => void;
  isDarkMode: boolean;
  presetTarget?: 'bank' | 'palmpay';
}

const NIGERIAN_BANKS: Bank[] = [
  { name: 'Access Bank',              code: '044' },
  { name: 'Citibank Nigeria',         code: '023' },
  { name: 'Ecobank Nigeria',          code: '050' },
  { name: 'Fidelity Bank',            code: '070' },
  { name: 'First Bank of Nigeria',    code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Globus Bank',              code: '00103' },
  { name: 'Guaranty Trust Bank',      code: '058' },
  { name: 'Heritage Bank',            code: '030' },
  { name: 'Jaiz Bank',                code: '301' },
  { name: 'Keystone Bank',            code: '082' },
  { name: 'Kuda Bank',                code: '50211' },
  { name: 'Moniepoint MFB',           code: '50515' },
  { name: 'OPay',                     code: '999992' },
  { name: 'Parallex Bank',            code: '526' },
  { name: 'Polaris Bank',             code: '076' },
  { name: 'Providus Bank',            code: '101' },
  { name: 'Stanbic IBTC Bank',        code: '039' },
  { name: 'Standard Chartered Bank',  code: '068' },
  { name: 'Sterling Bank',            code: '232' },
  { name: 'SunTrust Bank',            code: '100' },
  { name: 'Union Bank of Nigeria',    code: '032' },
  { name: 'United Bank for Africa',   code: '033' },
  { name: 'Unity Bank',               code: '215' },
  { name: 'VFD Microfinance Bank',    code: '566' },
  { name: 'Wema Bank',                code: '035' },
  { name: 'Zenith Bank',              code: '057' },
];

// PalmPay's Paystack bank code — used for phone-number resolution
const PALMPAY_BANK_CODE = '999991';

const genId = (len = 13) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const genSessionId = () =>
  Array.from({ length: 30 }, () => Math.floor(Math.random() * 10)).join('');

export default function TransferModal({
  isOpen,
  onClose,
  availableBalance,
  onTransferSuccess,
  isDarkMode,
  presetTarget = 'bank',
}: TransferModalProps) {
  const router = useRouter();

  const [transferType, setTransferType]   = useState<'bank' | 'palmpay'>(presetTarget);
  const [selectedBank, setSelectedBank]   = useState<Bank>(NIGERIAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNo, setPhoneNo]             = useState('');
  const [resolvedName, setResolvedName]   = useState('');
  const [resolveError, setResolveError]   = useState('');
  const [isResolving, setIsResolving]     = useState(false);
  const [amount, setAmount]               = useState('');
  const [remark, setRemark]               = useState('');
  const [errorText, setErrorText]         = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTransferType(presetTarget);
      setAccountNumber('');
      setPhoneNo('');
      setResolvedName('');
      setResolveError('');
      setAmount('');
      setRemark('');
      setErrorText('');
      setIsSubmitting(false);
    }
  }, [isOpen, presetTarget]);

  // ── Bank account number resolve (fires at exactly 10 digits) ──────────────
  useEffect(() => {
    if (transferType !== 'bank') return;
    setResolvedName('');
    setResolveError('');
    if (accountNumber.length !== 10) return;

    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    resolveTimer.current = setTimeout(() => {
      resolveFromPaystack(accountNumber, selectedBank.code);
    }, 400);

    return () => { if (resolveTimer.current) clearTimeout(resolveTimer.current); };
  }, [accountNumber, selectedBank, transferType]);

  // ── Re-resolve when bank changes mid-entry ────────────────────────────────
  useEffect(() => {
    if (transferType === 'bank' && accountNumber.length === 10) {
      setResolvedName('');
      setResolveError('');
      if (resolveTimer.current) clearTimeout(resolveTimer.current);
      resolveTimer.current = setTimeout(() => {
        resolveFromPaystack(accountNumber, selectedBank.code);
      }, 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBank]);

  // ── PalmPay phone resolve via Paystack (bank code 999991) ────────────────
  // Paystack supports resolving PalmPay accounts using the phone number
  // as the account_number and '999991' as the bank_code.
  useEffect(() => {
    if (transferType !== 'palmpay') return;
    setResolvedName('');
    setResolveError('');
    if (phoneNo.length !== 10) return;

    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    resolveTimer.current = setTimeout(() => {
      resolveFromPaystack(phoneNo, PALMPAY_BANK_CODE);
    }, 400);

    return () => { if (resolveTimer.current) clearTimeout(resolveTimer.current); };
  }, [phoneNo, transferType]);

  // ── Core Paystack resolve call ─────────────────────────────────────────────
  const resolveFromPaystack = async (identifier: string, bankCode: string) => {
    setIsResolving(true);
    setResolvedName('');
    setResolveError('');

    try {
      const res = await fetch(
        `/api/resolve-account?account_number=${identifier}&bank_code=${bankCode}`
      );
      const data = await res.json();

      if (!res.ok) {
        setResolveError(data.error ?? 'Account not found. Check the details and try again.');
      } else {
        setResolvedName(data.account_name);
      }
    } catch {
      setResolveError('Network error. Please check your connection and try again.');
    } finally {
      setIsResolving(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const amtNum = parseFloat(amount);

    if (isNaN(amtNum) || amtNum <= 0) {
      setErrorText('Please enter a valid transfer amount.');
      return;
    }
    if (amtNum > availableBalance) {
      setErrorText(
        `Insufficient funds. Available: ₦${availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}.`
      );
      return;
    }

    if (transferType === 'bank') {
      if (accountNumber.length !== 10) { setErrorText('NUBAN Account Number must be exactly 10 digits.'); return; }
      if (isResolving) { setErrorText('Still verifying account — please wait.'); return; }
      if (!resolvedName) { setErrorText(resolveError || 'Could not verify account. Check the number and bank.'); return; }
    } else {
      if (phoneNo.length !== 10) { setErrorText('PalmPay phone must be exactly 10 digits.'); return; }
      if (isResolving) { setErrorText('Still verifying PalmPay account — please wait.'); return; }
      if (!resolvedName) { setErrorText(resolveError || 'Could not verify PalmPay account. Check the phone number.'); return; }
    }

    setIsSubmitting(true);

    const narration =
      transferType === 'bank'
        ? `To ${resolvedName} (${selectedBank.name})`
        : `To PalmPay (${resolvedName})`;

    onTransferSuccess(amtNum, narration, transferType === 'palmpay');

    const receipt: ReceiptData = {
      amount: amtNum,
      recipientName: resolvedName.toUpperCase(),
      recipientBank: transferType === 'bank' ? selectedBank.name : 'PalmPay',
      recipientAccount:
        transferType === 'bank'
          ? accountNumber
          : phoneNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3'),
      senderName: 'RANDAL WILSON',
      senderBank: 'NairaPay',
      senderAccount: '805***3157',
      transactionType: 'Money Transfer - MMO',
      transactionId: genId(13),
      sessionId: genSessionId(),
      remark: remark || '',
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('np_last_receipt', JSON.stringify(receipt));
    setTimeout(() => router.push('/receipt'), 300);
  };

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
    isDarkMode
      ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple text-white'
      : 'bg-slate-50 border-slate-200 focus:border-wallet-purple text-slate-800'
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-wallet-dark border-wallet-dark-card-lighter text-white'
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'}`}>
              <div>
                <h3 className="font-display text-xl font-bold">Transfer Money</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zero routing commission on all transfers
                </p>
              </div>
              <button onClick={onClose} className={`p-2 rounded-full hover:scale-105 transition-transform ${isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

              {/* Balance */}
              <div className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold ${isDarkMode ? 'bg-wallet-dark-card-lighter text-emerald-400' : 'bg-slate-100 text-emerald-600'}`}>
                <span>Wallet Balance</span>
                <span className="font-mono text-sm font-bold">
                  ₦{availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 p-1 rounded-xl bg-zinc-500/10">
                {(['bank', 'palmpay'] as const).map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => { setTransferType(t); setResolvedName(''); setResolveError(''); setErrorText(''); }}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all ${
                      transferType === t ? 'bg-wallet-purple text-white shadow' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {t === 'bank' ? <Landmark className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    {t === 'bank' ? 'Other Banks' : 'To PalmPay'}
                  </button>
                ))}
              </div>

              {/* Bank fields */}
              {transferType === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Receiving Bank</label>
                    <select
                      value={selectedBank.code}
                      onChange={(e) => { const b = NIGERIAN_BANKS.find((b) => b.code === e.target.value); if (b) setSelectedBank(b); }}
                      className={inputCls}
                    >
                      {NIGERIAN_BANKS.map((bank) => (
                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Account Number (10 digits)</label>
                    <input
                      type="text" inputMode="numeric" maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 0123456789"
                      className={`${inputCls} font-mono tracking-widest`}
                      required
                    />
                    <p className="text-right text-[10px] text-slate-400 mt-1 font-semibold">{accountNumber.length}/10</p>
                  </div>
                </div>
              )}

              {/* PalmPay fields */}
              {transferType === 'palmpay' && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">PalmPay Phone Number</label>
                  <input
                    type="text" inputMode="numeric" maxLength={10}
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 09060592810"
                    className={`${inputCls} font-mono tracking-widest`}
                    required
                  />
                  <p className="text-right text-[10px] text-slate-400 mt-1 font-semibold">{phoneNo.length}/10</p>
                </div>
              )}

              {/* Resolution result */}
              {(isResolving || resolvedName || resolveError) && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border transition-colors ${
                  resolveError ? 'bg-red-500/5 border-red-500/20' : isDarkMode ? 'bg-wallet-dark-card/60 border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${resolveError ? 'bg-red-500/10 text-red-500' : 'bg-wallet-purple/10 text-wallet-purple'}`}>
                    {resolveError ? <AlertCircle className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {resolveError ? 'Resolution Failed' : 'Verified Account Name'}
                    </span>
                    {isResolving && (
                      <div className="flex items-center gap-1 mt-1">
                        {[100, 200, 300].map((d) => (
                          <div key={d} className="w-1.5 h-1.5 bg-wallet-purple rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                        <span className="text-xs font-medium text-slate-500 ml-1">Verifying…</span>
                      </div>
                    )}
                    {resolvedName && !isResolving && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-sm font-bold text-wallet-purple truncate">{resolvedName}</span>
                      </div>
                    )}
                    {resolveError && !isResolving && (
                      <span className="text-xs font-semibold text-red-500 mt-0.5 block">{resolveError}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Amount + Remark */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Amount (₦)</label>
                  <input
                    type="number" value={amount}
                    onChange={(e) => { setAmount(e.target.value); setErrorText(''); }}
                    placeholder="Amount to send"
                    className={inputCls} required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Remark (Optional)</label>
                  <input
                    type="text" value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="e.g. rent, bills"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Error */}
              {errorText && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isResolving}
                className="w-full py-3.5 bg-wallet-purple hover:bg-wallet-purple-hover disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  <>Confirm &amp; Route Transfer <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}