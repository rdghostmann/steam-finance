import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Landmark, Send, ArrowRightLeft, ArrowRight, UserCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { NIGERIAN_BANKS } from '@/data';
import { Bank } from '@/types';

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
  'Fatima Yar\'Adua',
  'Tunde Bakare Cole',
  'Efe Gbenebichie',
  'Ibrahim Danjuma Musa'
];

export default function TransferModal({
  isOpen,
  onClose,
  availableBalance,
  onTransferSuccess,
  isDarkMode,
  presetTarget = 'bank'
}: TransferModalProps) {
  const [transferType, setTransferType] = useState<'bank' | 'palmpay'>(presetTarget);
  const [selectedBank, setSelectedBank] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [resolvedName, setResolvedName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [errorText, setErrorText] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastTransferredAmount, setLastTransferredAmount] = useState(0);

  // Sync with preset target if modal is toggled open or closed
  useEffect(() => {
    if (isOpen) {
      setTransferType(presetTarget);
      setAccountNumber('');
      setPhoneNo('');
      setResolvedName('');
      setAmount('');
      setRemark('');
      setErrorText('');
      setSuccess(false);
    }
  }, [isOpen, presetTarget]);

  // Simulate name resolution on Account Number input
  useEffect(() => {
    if (transferType === 'bank' && accountNumber.length === 10) {
      resolveAccountName();
    } else if (transferType === 'bank' && accountNumber.length !== 10) {
      setResolvedName('');
    }
  }, [accountNumber, transferType]);

  // Simulate name resolution on PalmPay cellular telephone
  useEffect(() => {
    if (transferType === 'palmpay' && phoneNo.length === 11) {
      resolveAccountName();
    } else if (transferType === 'palmpay' && phoneNo.length !== 11) {
      setResolvedName('');
    }
  }, [phoneNo, transferType]);

  const resolveAccountName = () => {
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
      setErrorText(`Insufficient Funds. Your available balance is ₦${availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}.`);
      return;
    }

    if (transferType === 'bank') {
      if (accountNumber.length !== 10) {
        setErrorText('NUBAN Account Number must be exactly 10 digits.');
        return;
      }
      if (!resolvedName) {
        setErrorText('Could not resolve account recipient. Please type other random numbers to mock resolution.');
        return;
      }
    } else {
      if (phoneNo.length < 10) {
        setErrorText('PalmPay Account Phone Number must be 10 or 11 digits.');
        return;
      }
      if (!resolvedName) {
        setErrorText('Could not resolve PalmPay user name. Please try another number.');
        return;
      }
    }

    // Success Transfer
    setLastTransferredAmount(amtNum);
    
    const narration = transferType === 'bank'
      ? `To ${resolvedName} (${selectedBank})`
      : `To PalmPay Account (${resolvedName})`;

    onTransferSuccess(amtNum, narration, transferType === 'palmpay');
    setSuccess(true);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <div className={`p-6 border-b flex justify-between items-center ${
              isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'
            }`}>
              <div>
                <h3 className="font-display text-xl font-bold">Transfer Money</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Transfer securely with zero routing commission
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

            {!success ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Available Balance Marker */}
                <div className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                  isDarkMode ? 'bg-wallet-dark-card-lighter text-emerald-400' : 'bg-slate-100 text-emerald-600'
                }`}>
                  <span>Wallet Balance</span>
                  <span className="font-mono text-sm font-bold">₦{availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Transfer Selector */}
                <div className="flex gap-2 p-1 rounded-xl bg-opacity-40 bg-zinc-500/10">
                  <button
                    type="button"
                    onClick={() => {
                      setTransferType('bank');
                      setResolvedName('');
                      setErrorText('');
                    }}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all ${
                      transferType === 'bank'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    Other Banks
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferType('palmpay');
                      setResolvedName('');
                      setErrorText('');
                    }}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all ${
                      transferType === 'palmpay'
                        ? 'bg-wallet-purple text-white shadow'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    To PalmPay
                  </button>
                </div>

                {/* Other Banks specific selectors */}
                {transferType === 'bank' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold mb-1 block">Receive Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                          isDarkMode 
                            ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple text-white' 
                            : 'bg-slate-50 border-slate-200 focus:border-wallet-purple text-slate-800'
                        }`}
                      >
                        {NIGERIAN_BANKS.map((bank) => (
                          <option key={bank.code} value={bank.name}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-semibold mb-1 block">Account Number (10 Digits)</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 0123456789"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                          isDarkMode 
                            ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                            : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                        }`}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* To PalmPay specific selectors */}
                {transferType === 'palmpay' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold mb-1 block">PalmPay User Phone Number (Mobile)</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 09060592810"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                          isDarkMode 
                            ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple font-mono' 
                            : 'bg-slate-50 border-slate-200 focus:border-wallet-purple font-mono'
                        }`}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Recipient Resolution Showcase */}
                {(isResolving || resolvedName) && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border transition-colors ${
                    isDarkMode ? 'bg-wallet-dark-card/60 border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-wallet-purple/10 flex items-center justify-center text-wallet-purple">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">Verified Account Name</span>
                      {isResolving ? (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-wallet-purple rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-wallet-purple rounded-full animate-bounce delay-200"></div>
                          <div className="w-1.5 h-1.5 bg-wallet-purple rounded-full animate-bounce delay-300"></div>
                          <span className="text-xs font-medium text-slate-500 ml-1">resolving credentials...</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-wallet-purple">{resolvedName}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Amount and Remark */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Amount (₦)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrorText('');
                      }}
                      placeholder="Amount to send"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                        isDarkMode 
                          ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                          : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                      }`}
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
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                        isDarkMode 
                          ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                          : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                      }`}
                    />
                  </div>
                </div>

                {/* Overdraft Error Notification */}
                {errorText && (
                  <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorText}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  Confirm & Route Transfer <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Success Transfer Screen mockup */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-wallet-purple/10 text-wallet-purple rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <CheckCircle2 className="w-10 h-10 text-wallet-green" />
                </div>
                <h4 className="font-display text-2xl font-bold">Transfer Dispatched!</h4>
                <p className={`text-sm max-w-xs mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  You successfully transferred <span className="font-bold text-red-500 font-mono">₦{lastTransferredAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span> to <span className="font-bold">{resolvedName}</span>.
                </p>

                <div className={`p-4 rounded-xl text-left text-xs space-y-2 mt-4 mx-auto max-w-sm ${
                  isDarkMode ? 'bg-wallet-dark-card' : 'bg-slate-50'
                }`}>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recipient Bank</span>
                    <span className="font-bold">{transferType === 'bank' ? selectedBank : 'PalmPay Wallet'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commission Fee</span>
                    <span className="text-emerald-500 font-bold">N0.00 (FREE!)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Narration</span>
                    <span className="font-semibold text-slate-400">{remark || 'None'}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCloseSuccess}
                    className="w-full py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl text-sm font-bold shadow transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
