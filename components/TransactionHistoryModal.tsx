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
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-wallet-dark border-wallet-dark-card-lighter text-white' 
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${
              isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'
            }`}>
              <div>
                <h3 className="font-display text-xl font-bold">Transaction History</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {filteredTransactions.length} of {transactions.length} records
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
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-wallet-dark-card border border-wallet-dark-card-lighter focus:border-wallet-purple text-white placeholder-slate-500' 
                        : 'bg-slate-50 border border-slate-200 focus:border-wallet-purple text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-opacity-40 bg-zinc-500/10">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedType === 'all'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedType('credit')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedType === 'credit'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Inflow (+)
                  </button>
                  <button
                    onClick={() => setSelectedType('debit')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedType === 'debit'
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
                        className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${
                          isDarkMode 
                            ? 'bg-wallet-dark-card hover:bg-wallet-dark-card-lighter' 
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            isDarkMode ? 'bg-wallet-dark' : 'bg-white border border-slate-100'
                          }`}>
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
                            tx.status === 'Successful' 
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-sm rounded-[2rem] p-6 text-center border overflow-hidden transition-all duration-300 ${
              isDarkMode 
                ? 'bg-wallet-dark border-wallet-dark-card-lighter text-white' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Top decorative receipt cut or check icon */}
            <div className="w-12 h-12 bg-wallet-purple/10 text-wallet-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Landmark className="w-6 h-6 animate-pulse" />
            </div>

            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Transaction Receipt
            </p>
            <h4 className="font-display text-2xl font-bold text-wallet-purple">
              {['deposit', 'interest', 'commission'].includes(selectedTx.type) ? '+' : '-'}
              {formatCurrency(selectedTx.amount)}
            </h4>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-emerald-500/10 text-emerald-500 mx-auto">
              <Check className="w-3.5 h-3.5" /> {selectedTx.status}
            </span>

            <div className={`mt-6 p-4 rounded-2xl text-left text-xs space-y-3 ${
              isDarkMode ? 'bg-wallet-dark-card' : 'bg-slate-50'
            }`}>
              <div className="flex justify-between items-center border-b border-dashed border-slate-500/15 pb-2">
                <span className="text-slate-500">Service / Activity</span>
                <span className="font-semibold">{selectedTx.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed border-slate-500/15 pb-2">
                <span className="text-slate-500">Timestamp</span>
                <span className="font-mono text-slate-400">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed border-slate-500/15 pb-2">
                <span className="text-slate-500">Payment Status</span>
                <span className="text-emerald-500 font-medium">SUCCESSFUL</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-slate-500">Reference Number</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] break-all select-all">{selectedTx.reference}</span>
                  <button
                    onClick={() => handleCopy(selectedTx.reference)}
                    className="p-1 rounded hover:bg-slate-500/15 text-slate-400 transition"
                  >
                    {copiedTxId === selectedTx.reference ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="mt-6 w-full py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition-all"
            >
              Done & Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
