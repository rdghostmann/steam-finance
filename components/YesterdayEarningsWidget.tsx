import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Info, Wallet, Award, Sparkles, Plus, Landmark, HelpCircle, RefreshCw } from 'lucide-react';

interface YesterdayEarningsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  yesterdayEarnings: number;
  availableBalance: number;
  onClaimInterest: (amount: number) => void;
  isDarkMode: boolean;
}

export default function YesterdayEarningsWidget({
  isOpen,
  onClose,
  yesterdayEarnings,
  availableBalance,
  onClaimInterest,
  isDarkMode
}: YesterdayEarningsWidgetProps) {
  const [calculatorInput, setCalculatorInput] = useState('20000');
  const [calculatorYield, setCalculatorYield] = useState('mutual'); // 'cashbox' (20%) or 'mutual' (101.19%)
  const [claimed, setClaimed] = useState(false);

  // Calculate yield returns
  const parsedInput = parseFloat(calculatorInput) || 0;
  const rate = calculatorYield === 'mutual' ? 1.0119 : 0.20;
  const annualEarn = parsedInput * rate;
  const monthlyEarn = annualEarn / 12;
  const dailyEarn = annualEarn / 365;

  const handleClaim = () => {
    if (yesterdayEarnings <= 0) return;
    onClaimInterest(yesterdayEarnings);
    setClaimed(true);
    setTimeout(() => {
      setClaimed(false);
      onClose();
    }, 1800);
  };

  const yieldData = [
    { title: 'Base Interest (Today)', amount: 0.02, frequency: 'Daily Payout', source: 'Spend & Save @ 12.5%' },
    { title: 'Cashbox Yield Accumulation', amount: parseFloat((availableBalance * 0.20 / 365).toFixed(4)), frequency: 'Daily Accrual', source: 'CashBox high yield @ 20.0%' },
    { title: 'Mutual Capital Outflow', amount: parseFloat((availableBalance * 1.0119 / 365).toFixed(4)), frequency: 'Daily Accrual', source: 'Mutual Funds @ 101.19%' },
  ];

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
                <h3 className="font-display text-xl font-bold flex items-center gap-1.5">
                  <TrendingUp className="text-wallet-purple w-5 h-5" />
                  <span>Yield Analytics & Earnings</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Earn interest payouts computed recursively every hour
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

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Yesterday's Payout Claim Widget */}
              <div className={`p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between border ${
                isDarkMode ? 'bg-gradient-to-br from-wallet-dark-card to-wallet-dark-card-lighter border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
              }`}>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Unclaimed Yesterday Earnings</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full">
                      Updating Live
                    </span>
                  </div>
                  <h4 className="font-display text-2xl font-bold text-wallet-purple mt-2">
                    +₦{(yesterdayEarnings).toFixed(2)} Naira
                  </h4>
                </div>

                {!claimed ? (
                  <button
                    onClick={handleClaim}
                    className="w-full mt-4 py-2.5 bg-wallet-purple hover:bg-wallet-purple-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-4.5 h-4.5" /> Claim Earnings to Wallet
                  </button>
                ) : (
                  <div className="w-full mt-4 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                    <Award className="w-4.5 h-4.5 animate-spin" /> Yield Successfully Dispatched!
                  </div>
                )}
              </div>

              {/* Dynamic calculations on balance */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Yield Source Breakdowns</h5>
                <div className="space-y-2">
                  {yieldData.map((y, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl flex justify-between items-center text-xs ${
                        isDarkMode ? 'bg-wallet-dark-card/60' : 'bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">{y.title}</span>
                        <span className="text-[10px] text-slate-500">{y.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-500 block">+₦{y.amount}</span>
                        <span className="text-[9px] text-slate-500 font-semibold">{y.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compound Interest Calculator */}
              <div className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-wallet-dark-card/40 border-wallet-dark-card-lighter' : 'bg-slate-100/50 border-slate-200'
              }`}>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-wallet-purple animate-spin" />
                  <span>Compound Capital Interest Estimator</span>
                </h5>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Estimated Deposit Capital (₦)</label>
                    <input
                      type="number"
                      value={calculatorInput}
                      onChange={(e) => setCalculatorInput(e.target.value)}
                      placeholder="e.g. 50000"
                      className={`w-full px-3 py-2 rounded-xl text-xs outline-none border ${
                        isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter focus:border-wallet-purple' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>

                  {/* Vault tier selection */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCalculatorYield('cashbox')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                        calculatorYield === 'cashbox'
                          ? 'bg-wallet-purple text-white'
                          : isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      CashBox (20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalculatorYield('mutual')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                        calculatorYield === 'mutual'
                          ? 'bg-wallet-purple text-white'
                          : isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Mutual Funds (101.19%)
                    </button>
                  </div>

                  {/* Formula Results Output */}
                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-dashed border-slate-500/10 text-center">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-semibold">Daily Return</span>
                      <span className="font-mono text-xs font-bold text-emerald-500">+₦{dailyEarn.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-semibold">Monthly Return</span>
                      <span className="font-mono text-xs font-bold text-emerald-500">+₦{monthlyEarn.toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-semibold">Annual Yield</span>
                      <span className="font-mono text-xs font-bold text-wallet-purple">+₦{annualEarn.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
