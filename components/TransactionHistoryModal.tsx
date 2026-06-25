import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ArrowDownLeft, ArrowUpRight, Copy, Check, Calendar, Landmark, Percent, Phone, Wifi, Shield, Zap, CircleAlert, Trophy } from 'lucide-react';
import { Transaction } from '@/types';
// import { Transaction } from '../types';

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
  isDarkMode
}: TransactionHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' ||
      (selectedType === 'credit' && ['deposit', 'interest', 'commission'].includes(tx.type)) ||
      (selectedType === 'debit' && ['transfer', 'airtime', 'data', 'service'].includes(tx.type));
    return matchesSearch && matchesType;
  });

  const handleCopy = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedTxId(ref);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-emerald-500 w-5 h-5" />;
      case 'transfer':
        return <ArrowUpRight className="text-red-500 w-5 h-5" />;
      case 'airtime':
        return <Phone className="text-sky-500 w-5 h-5" />;
      case 'data':
        return <Wifi className="text-teal-400 w-5 h-5" />;
      case 'interest':
        return <Percent className="text-emerald-400 w-5 h-5" />;
      case 'commission':
        return <Trophy className="text-amber-500 w-5 h-5" />;
      default:
        return <Zap className="text-purple-400 w-5 h-5" />;
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amt);
  };

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-300 ${isDarkMode
                ? 'bg-wallet-dark border-wallet-dark-card-lighter text-white'
                : 'bg-white border-slate-100 text-slate-800'
              }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'
              }`}>
              <div>
                <h3 className="font-display text-xl font-bold">Transaction History</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {filteredTransactions.length} of {transactions.length} records
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:scale-105 transition-transform ${isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List & Controls Panel */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className={`absolute left-3.5 top-3 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    placeholder="Search by name, reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${isDarkMode
                        ? 'bg-wallet-dark-card border border-wallet-dark-card-lighter focus:border-wallet-purple text-white placeholder-slate-500'
                        : 'bg-slate-50 border border-slate-200 focus:border-wallet-purple text-slate-800 placeholder-slate-400'
                      }`}
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-opacity-40 bg-zinc-500/10">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === 'all'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedType('credit')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === 'credit'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                  >
                    Inflow (+)
                  </button>
                  <button
                    onClick={() => setSelectedType('debit')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === 'debit'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                  >
                    Outflow (-)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
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
                        onClick={() => setSelectedTx(tx)}
                        className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${isDarkMode
                            ? 'bg-wallet-dark-card hover:bg-wallet-dark-card-lighter'
                            : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-wallet-dark' : 'bg-white border border-slate-100'
                            }`}>
                            {getTxIcon(tx.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs md:text-sm line-clamp-1">{tx.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{tx.date}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-display text-xs md:text-sm font-bold ${isCredit ? 'text-wallet-green' : isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                            {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                          <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium ${tx.status === 'Successful'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : tx.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-500'
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

              {/* Clear Option */}
              {onClearHistory && transactions.length > 0 && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your interactive transaction logs?")) {
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

      {/* Detail Receipt Overlay Modal */}
      {/* PalmPay Style Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTx(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative w-full max-w-sm rounded-3xl overflow-hidden ${isDarkMode
                ? "bg-wallet-dark text-white"
                : "bg-white text-slate-800"
              }`}
          >
            {/* Success Header */}
            <div className="bg-[#6c3df4] px-6 py-8 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-[#6c3df4]" />
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Transaction Successful
              </h3>

              <p className="text-white/80 text-xs mt-1">
                Transaction Receipt
              </p>

              <h2 className="text-3xl font-bold mt-4">
                {formatCurrency(selectedTx.amount)}
              </h2>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4">

              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">
                  Transaction Type
                </span>
                <span className="font-semibold capitalize">
                  {selectedTx.type}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">
                  Description
                </span>
                <span className="font-semibold text-right max-w-[180px]">
                  {selectedTx.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">
                  Date
                </span>
                <span className="font-medium">
                  {selectedTx.date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">
                  Status
                </span>
                <span className="text-green-500 font-semibold">
                  {selectedTx.status}
                </span>
              </div>

              <div className="border-t border-dashed pt-4">
                <p className="text-slate-500 text-xs mb-2">
                  Reference Number
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs break-all">
                    {selectedTx.reference}
                  </span>

                  <button
                    onClick={() => handleCopy(selectedTx.reference)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                  >
                    {copiedTxId === selectedTx.reference ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Button */}
              <button
                className="w-full py-3 rounded-xl bg-[#6c3df4] text-white font-semibold"
              >
                Share Receipt
              </button>

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 rounded-xl border border-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
