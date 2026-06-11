import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Landmark, Smartphone, PiggyBank, Copy, Check, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, methodTitle: string) => void;
  isDarkMode: boolean;
}

type Method = 'card' | 'transfer' | 'ussd';

export default function AddMoneyModal({
  isOpen,
  onClose,
  onDepositSuccess,
  isDarkMode
}: AddMoneyModalProps) {
  const [activeMethod, setActiveMethod] = useState<Method>('card');
  const [amount, setAmount] = useState<string>('5000');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('RANDAL CHUKZ');

  // Copy helpers
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Success states
  const [success, setSuccess] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    let methodLabel = "Card Deposit";
    if (activeMethod === 'transfer') {
      methodLabel = "Bank Transfer Settlement";
    } else if (activeMethod === 'ussd') {
      methodLabel = "USSD Bank Transfer";
    }

    setFinalAmount(amtNum);
    setSuccess(true);
    
    // Trigger callback
    onDepositSuccess(amtNum, methodLabel);
  };

  const resetAndClose = () => {
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
                <h3 className="font-display text-xl font-bold">Fund Wallet</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Add money securely to your available balance
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
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Method selector tabs */}
                <div className="flex gap-2 p-1.5 rounded-2xl bg-opacity-40 bg-zinc-500/10">
                  <button
                    onClick={() => setActiveMethod('card')}
                    className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMethod === 'card'
                        ? 'bg-wallet-purple text-white shadow-lg'
                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    Debit Card
                  </button>
                  <button
                    onClick={() => setActiveMethod('transfer')}
                    className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMethod === 'transfer'
                        ? 'bg-wallet-purple text-white shadow-lg'
                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Landmark className="w-4 h-4 mb-1" />
                    Bank Transfer
                  </button>
                  <button
                    onClick={() => setActiveMethod('ussd')}
                    className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMethod === 'ussd'
                        ? 'bg-wallet-purple text-white shadow-lg'
                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mb-1" />
                    USSD Code
                  </button>
                </div>

                {/* Card input panel */}
                {activeMethod === 'card' && (
                  <form onSubmit={handleDeposit} className="space-y-4">
                    {/* Interactive debit card visualizer */}
                    <div className="w-full h-40 rounded-2xl p-4 bg-gradient-to-br from-wallet-purple to-pink-500 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-12 translate-x-10 pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-sm tracking-widest font-semibold text-white/90">NairaPay Card</span>
                        <div className="w-10 h-7 bg-white/20 rounded-md backdrop-blur flex items-center justify-center font-bold text-[10px]">
                          Debit
                        </div>
                      </div>
                      <div className="font-mono text-lg tracking-widest my-2">
                        {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[9px] uppercase text-white/60 block">Card Holder</span>
                          <span className="font-mono text-xs uppercase tracking-wide truncate max-w-[150px] inline-block">{cardName || 'RANDAL CHUKZ'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-white/60 block">Expires</span>
                          <span className="font-mono text-xs">{expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Form Controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Quick Amount</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['1000', '5000', '10000', '25000'].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setAmount(val)}
                              className={`py-2 text-xs font-semibold rounded-xl text-center border transition-all ${
                                amount === val
                                  ? 'bg-wallet-purple text-white border-wallet-purple'
                                  : isDarkMode 
                                    ? 'bg-wallet-dark-card border-wallet-dark-card-lighter hover:border-slate-600' 
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              ₦{parseInt(val).toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Custom Amount (₦)</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                              isDarkMode 
                                ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                                : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Card Number</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="4000 1234 5678 9010"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                            isDarkMode 
                              ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                              : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                          }`}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Expiry Date</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                              isDarkMode 
                                ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                                : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                              isDarkMode 
                                ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                                : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                            }`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Fund Wallet Instantly
                    </button>
                  </form>
                )}

                {/* Bank transfer panel */}
                {activeMethod === 'transfer' && (
                  <div className="space-y-4">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Transfer funds from any of your real banking apps using your personalized virtual Wema/PalmPay account below:
                    </p>

                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Bank Name</span>
                          <span className="font-semibold text-sm">PalmPay Digital Bank</span>
                        </div>
                        <span className="text-[10px] bg-wallet-purple/10 text-wallet-purple font-semibold px-2.5 py-1 rounded-full">
                          Live Active
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-500/10 pt-3">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Account Number</span>
                          <span className="font-mono text-base font-bold text-wallet-purple">9060592810</span>
                        </div>
                        <button
                          onClick={() => handleCopy('9060592810', 'account')}
                          className="px-3 py-1.5 rounded-xl text-xs bg-wallet-purple/15 hover:bg-wallet-purple/20 text-wallet-purple transition font-semibold"
                        >
                          {copiedText === 'account' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-500/10 pt-3">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Account Name</span>
                          <span className="font-semibold text-sm">RANDAL CHUKZ WILSON / NY_NPRY</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-dashed border-slate-500/10">
                      <label className="text-xs text-slate-400 font-semibold mb-2 block">Simulate Incoming Amount</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['5000', '10000', '50000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => {
                              setAmount(val);
                              onDepositSuccess(parseFloat(val), "Bank Transfer Settlement");
                              setFinalAmount(parseFloat(val));
                              setSuccess(true);
                            }}
                            className="py-2.5 bg-wallet-purple hover:bg-wallet-purple-hover text-white text-xs font-bold rounded-xl transition"
                          >
                            + ₦{parseInt(val).toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* USSD method panel */}
                {activeMethod === 'ussd' && (
                  <div className="space-y-4">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Select your bank to generate the instant funding USSD dial code:
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { bank: 'GTBank', code: '*737*2*Amount*9060592810#' },
                        { bank: 'Access Bank', code: '*901*2*Amount*9060592810#' },
                        { bank: 'Zenith Bank', code: '*966*Amount*9060592810#' },
                        { bank: 'UBA', code: '*919*20*Amount*9060592810#' }
                      ].map((item) => (
                        <div
                          key={item.bank}
                          className={`p-3 rounded-xl border text-center relative overflow-hidden flex flex-col justify-between ${
                            isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <span className="font-bold text-xs uppercase text-slate-400 block">{item.bank}</span>
                          <span className="font-mono text-[10px] text-wallet-purple font-semibold my-2 truncate block">{item.code.replace('Amount', 'Amount')}</span>
                          <button
                            onClick={() => {
                              const calculatedCode = item.code.replace('Amount', amount);
                              handleCopy(calculatedCode, item.bank);
                              alert(`Simulated: Dialing ${calculatedCode} on your cellular phone...`);
                              onDepositSuccess(parseFloat(amount), `USSD Deposit (${item.bank})`);
                              setFinalAmount(parseFloat(amount));
                              setSuccess(true);
                            }}
                            className="w-full py-1.5 bg-wallet-purple hover:bg-wallet-purple-hover text-white text-[10px] font-bold rounded-lg transition"
                          >
                            Dial
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-semibold mb-1 block">Dialer Preset Amount (₦)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Dialer Amount"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                          isDarkMode 
                            ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' 
                            : 'bg-slate-50 border-slate-200 focus:border-wallet-purple'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Success Banner */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-display text-2xl font-bold">Wallet Funded!</h4>
                <p className={`text-sm max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your Naira Wallet has been successfully credited with <span className="font-bold text-wallet-purple font-mono">₦{finalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>.
                </p>
                
                <div className="pt-4">
                  <button
                    onClick={resetAndClose}
                    className="w-full py-3 bg-wallet-purple hover:bg-wallet-purple-hover text-white rounded-xl text-sm font-bold shadow transition-all"
                  >
                    Return to Dashboard
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
