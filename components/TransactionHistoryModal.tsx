'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  X, Search, ArrowDownLeft, ArrowUpRight, Copy, Check,
  Phone, Wifi, Percent, Trophy, Zap, CircleAlert
} from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onClearHistory?: () => void;
  isDarkMode: boolean;
}

export default function TransactionHistoryModal({
  isOpen,
  onClose,
  transactions,
  onClearHistory,
  isDarkMode,
}: TransactionHistoryModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'credit' && ['deposit', 'interest', 'commission'].includes(tx.type)) ||
      (selectedType === 'debit' && ['transfer', 'airtime', 'data', 'service'].includes(tx.type));
    return matchesSearch && matchesType;
  });

  const handleTxClick = (tx: Transaction) => {
    localStorage.setItem('np_selected_transaction', JSON.stringify(tx));
    onClose();
    router.push('/transaction');
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'deposit':    return <ArrowDownLeft className="text-emerald-500 w-5 h-5" />;
      case 'transfer':   return <ArrowUpRight className="text-red-500 w-5 h-5" />;
      case 'airtime':    return <Phone className="text-sky-500 w-5 h-5" />;
      case 'data':       return <Wifi className="text-teal-400 w-5 h-5" />;
      case 'interest':   return <Percent className="text-emerald-400 w-5 h-5" />;
      case 'commission': return <Trophy className="text-amber-500 w-5 h-5" />;
      default:           return <Zap className="text-purple-400 w-5 h-5" />;
    }
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amt);

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-300 ${
              isDarkMode
                ? 'bg-wallet-dark border-wallet-dark-card-lighter text-white'
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'}`}>
              <div>
                <h3 className="font-display text-xl font-bold">Transaction History</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {filteredTransactions.length} of {transactions.length} records
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:scale-105 transition-transform ${isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Search */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className={`absolute left-3.5 top-3 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    placeholder="Search by name, reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                      isDarkMode
                        ? 'bg-wallet-dark-card border border-wallet-dark-card-lighter focus:border-wallet-purple text-white placeholder-slate-500'
                        : 'bg-slate-50 border border-slate-200 focus:border-wallet-purple text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-zinc-500/10">
                  {[
                    { key: 'all',    label: 'All Types' },
                    { key: 'credit', label: 'Inflow (+)' },
                    { key: 'debit',  label: 'Outflow (-)' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedType(tab.key)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        selectedType === tab.key
                          ? 'bg-wallet-purple text-white shadow'
                          : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <CircleAlert className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      No matching transaction entries found.
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isCredit = ['deposit', 'interest', 'commission'].includes(tx.type);
                    return (
                      <div
                        key={tx.id}
                        onClick={() => handleTxClick(tx)}
                        className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${
                          isDarkMode
                            ? 'bg-wallet-dark-card hover:bg-wallet-dark-card-lighter'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-wallet-dark' : 'bg-white border border-slate-100'}`}>
                            {getTxIcon(tx.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs md:text-sm line-clamp-1">{tx.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{tx.date}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-display text-xs md:text-sm font-bold ${
                            isCredit ? 'text-wallet-green' : isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                          <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium ${
                            tx.status === 'Successful' ? 'bg-emerald-500/10 text-emerald-500'
                            : tx.status === 'Pending'  ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Clear */}
              {onClearHistory && transactions.length > 0 && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your transaction logs?')) {
                        onClearHistory();
                      }
                    }}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    Clear transaction simulation history
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}