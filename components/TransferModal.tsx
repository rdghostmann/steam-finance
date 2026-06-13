'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  X, Landmark, Send, UserCheck, AlertCircle, ArrowRight,
} from 'lucide-react';
import { NIGERIAN_BANKS } from '@/data';
import { ReceiptData } from '@/types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onTransferSuccess: (amount: number, description: string, isPalmPay: boolean) => void;
  isDarkMode: boolean;
  presetTarget?: 'bank' | 'palmpay';
}

const MOCK_NAMES = [
  'Amina Bello Abubakar',
  'Chinedu Emmanuel Okechukwu',
  'Olawale Segun Adesina',
  'Blessing Chioma Nwachukwu',
  "Fatima Yar'Adua",
  'Tunde Bakare Cole',
  'Efe Gbenebichie',
  'Ibrahim Danjuma Musa',
];

/** Generates a pseudo-random alphanumeric ID */
const genId = (prefix: string, len = 13) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
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

  const [transferType, setTransferType] = useState<'bank' | 'palmpay'>(presetTarget);
  const [selectedBank, setSelectedBank] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [resolvedName, setResolvedName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setTransferType(presetTarget);
      setAccountNumber('');
      setPhoneNo('');
      setResolvedName('');
      setAmount('');
      setRemark('');
      setErrorText('');
      setIsSubmitting(false);
    }
  }, [isOpen, presetTarget]);

  // Resolve bank account name
  useEffect(() => {
    if (transferType === 'bank' && accountNumber.length === 10) {
      triggerResolve();
    } else if (transferType === 'bank' && accountNumber.length !== 10) {
      setResolvedName('');
    }
  }, [accountNumber, transferType]);

  // Resolve PalmPay phone
  useEffect(() => {
    if (transferType === 'palmpay' && phoneNo.length === 11) {
      triggerResolve();
    } else if (transferType === 'palmpay' && phoneNo.length !== 11) {
      setResolvedName('');
    }
  }, [phoneNo, transferType]);

  const triggerResolve = () => {
    setIsResolving(true);
    setResolvedName('');
    setTimeout(() => {
      const idx = Math.floor(Math.random() * MOCK_NAMES.length);
      setResolvedName(MOCK_NAMES[idx]);
      setIsResolving(false);
    }, 1200);
  };

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
        `Insufficient Funds. Available: ₦${availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}.`
      );
      return;
    }
    if (transferType === 'bank') {
      if (accountNumber.length !== 10) {
        setErrorText('NUBAN Account Number must be exactly 10 digits.');
        return;
      }
      if (!resolvedName) {
        setErrorText('Could not resolve account recipient. Please try again.');
        return;
      }
    } else {
      if (phoneNo.length < 10) {
        setErrorText('PalmPay phone must be 10 or 11 digits.');
        return;
      }
      if (!resolvedName) {
        setErrorText('Could not resolve PalmPay user. Please try again.');
        return;
      }
    }

    setIsSubmitting(true);

    // 1. Notify HomePage to update balance + transactions
    const narration =
      transferType === 'bank'
        ? `To ${resolvedName} (${selectedBank})`
        : `To PalmPay Account (${resolvedName})`;

    onTransferSuccess(amtNum, narration, transferType === 'palmpay');

    // 2. Build receipt data
    const receipt: ReceiptData = {
      amount: amtNum,
      recipientName: resolvedName.toUpperCase(),
      recipientBank: transferType === 'bank' ? selectedBank : 'PalmPay',
      recipientAccount:
        transferType === 'bank'
          ? accountNumber
          : phoneNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3'),
      senderName: 'RANDAL WILSON',
      senderBank: 'NairaPay',
      senderAccount: '805***3157',
      transactionType: 'Money Transfer - MMO',
      transactionId: genId('', 13),
      sessionId: genSessionId(),
      remark: remark || '',
      timestamp: new Date().toISOString(),
    };

    // 3. Persist to localStorage then navigate
    localStorage.setItem('np_last_receipt', JSON.stringify(receipt));

    // Small delay so the success toast in HomePage has time to register
    setTimeout(() => {
      router.push('/receipt');
    }, 300);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
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
            <div
              className={`p-6 border-b flex justify-between items-center ${
                isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="font-display text-xl font-bold">Transfer Money</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zero routing commission on all transfers
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:scale-105 transition-transform ${
                  isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

              {/* Balance pill */}
              <div
                className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-wallet-dark-card-lighter text-emerald-400'
                    : 'bg-slate-100 text-emerald-600'
                }`}
              >
                <span>Wallet Balance</span>
                <span className="font-mono text-sm font-bold">
                  ₦{availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Tab toggle */}
              <div className="flex gap-2 p-1 rounded-xl bg-zinc-500/10">
                {(['bank', 'palmpay'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTransferType(t);
                      setResolvedName('');
                      setErrorText('');
                    }}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all ${
                      transferType === t
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-800'
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
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className={inputCls}
                    >
                      {NIGERIAN_BANKS.map((bank) => (
                        <option key={bank.code} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">
                      Account Number (10 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 0123456789"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              )}

              {/* PalmPay fields */}
              {transferType === 'palmpay' && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">
                    PalmPay Phone Number
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 09060592810"
                    className={`${inputCls} font-mono`}
                    required
                  />
                </div>
              )}

              {/* Name resolution */}
              {(isResolving || resolvedName) && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 border transition-colors ${
                    isDarkMode
                      ? 'bg-wallet-dark-card/60 border-wallet-dark-card-lighter'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-wallet-purple/10 flex items-center justify-center text-wallet-purple">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">Verified Account Name</span>
                    {isResolving ? (
                      <div className="flex items-center gap-1 mt-1">
                        {[100, 200, 300].map((d) => (
                          <div
                            key={d}
                            className="w-1.5 h-1.5 bg-wallet-purple rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                        <span className="text-xs font-medium text-slate-500 ml-1">resolving…</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-wallet-purple">{resolvedName}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Amount + Remark */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Amount (₦)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setErrorText(''); }}
                    placeholder="Amount to send"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Remark (Optional)</label>
                  <input
                    type="text"
                    value={remark}
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
                disabled={isSubmitting}
                className="w-full py-3.5 bg-wallet-purple hover:bg-wallet-purple-hover disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Confirm &amp; Route Transfer <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}