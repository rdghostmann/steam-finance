import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Lock, Eye, EyeOff, Check, RefreshCw, SmartphoneNfc } from 'lucide-react';

interface VirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function VirtualCardModal({
  isOpen,
  onClose,
  isDarkMode
}: VirtualCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(150000);
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [pin, setPin] = useState('••••');
  const [newPin, setNewPin] = useState('');
  
  const handleLockCard = () => {
    setIsCardLocked(!isCardLocked);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      alert("PIN must be exactly 4 digits.");
      return;
    }
    setPin(newPin);
    setNewPin('');
    setPinChangeOpen(false);
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
                <h3 className="font-display text-xl font-bold">ATM Virtual Card</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Manage active web physical & contactless limits
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

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Card Container with animated flip */}
              <div 
                className="w-full h-52 relative border-0 focus:outline-none cursor-pointer [perspective:1000px]"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className="w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d]"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Front Side */}
                  <div className={`absolute w-full h-full p-6 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-700 text-white flex flex-col justify-between shadow-lg [backface-visibility:hidden] overflow-hidden ${
                    isCardLocked ? 'grayscale opacity-75' : ''
                  }`}>
                    {/* Metallic glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
                    
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <span className="font-display font-medium text-xs tracking-wider uppercase opacity-80 block">NairaPay Digital</span>
                        <span className="text-[10px] text-zinc-300 font-bold tracking-widest mt-0.5 block flex items-center gap-1">
                          <SmartphoneNfc className="w-3 h-3 text-white/80" /> Contactless Active
                        </span>
                      </div>
                      <span className="font-mono text-xs uppercase font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur">
                        vCard
                      </span>
                    </div>

                    <div className="z-10">
                      <span className="text-[10px] uppercase text-zinc-300 tracking-wider">Card Number</span>
                      <div className="font-mono text-lg font-bold tracking-[0.2em] my-1 flex items-center gap-2">
                        {showNumbers ? '5061 9301 2294 3845' : '•••• •••• •••• 3845'}
                      </div>
                    </div>

                    <div className="flex justify-between items-end z-10">
                      <div>
                        <span className="text-[9px] uppercase text-zinc-400 block tracking-wider">Card Holder</span>
                        <span className="font-mono text-sm tracking-wide font-semibold">RANDAL CHUKZ</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase text-zinc-400 block tracking-wider">Expiry</span>
                        <span className="font-mono text-sm font-semibold">09/29</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full rounded-2xl bg-gradient-to-bl from-indigo-800 to-slate-900 border border-indigo-500/20 text-white flex flex-col justify-between shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                    <div className="w-full h-10 bg-zinc-950 mt-4" />
                    
                    <div className="px-6 flex justify-between items-center">
                      <div className="flex-1 bg-white/10 h-8 rounded-lg flex items-center px-3 justify-end italic text-slate-400 font-mono text-sm">
                        Signature Line
                      </div>
                      <div className="ml-3 font-mono bg-white text-zinc-800 h-8 w-12 rounded-lg flex items-center justify-center font-bold">
                        984
                      </div>
                    </div>

                    <div className="px-6 pb-4 flex justify-between items-end text-[9px] text-zinc-400 font-mono">
                      <span>Customer Support: 0800-NAIRAPAY</span>
                      <span>CVV Code</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Instructions text */}
              <p className={`text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFlipped ? "Tap card back to view Front" : "Tap the virtual ATM card to toggle Flip showing CVV."}
              </p>

              {/* Action grid options */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleLockCard}
                  className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isCardLocked
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-inner'
                      : isDarkMode 
                        ? 'bg-wallet-dark-card border-wallet-dark-card-lighter hover:border-slate-700 hover:bg-white/5' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Lock className={`w-3.5 h-3.5 ${isCardLocked ? 'animate-pulse' : ''}`} />
                  {isCardLocked ? 'Unfreeze ATM Card' : 'Freeze Card'}
                </button>

                <button
                  onClick={() => setShowNumbers(!showNumbers)}
                  className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isDarkMode 
                      ? 'bg-wallet-dark-card border-wallet-dark-card-lighter hover:border-slate-700 hover:bg-white/5' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {showNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showNumbers ? 'Hide Card Details' : 'View Numbers'}
                </button>
              </div>

              {/* Slider for limits */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Daily Web Limit</span>
                  <span className="text-wallet-purple font-mono">₦{dailyLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="50000"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  className="w-full accent-wallet-purple cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                  <span>₦10K</span>
                  <span>₦500K</span>
                  <span>₦1.0M</span>
                </div>
              </div>

              {/* Pin update module */}
              {!pinChangeOpen ? (
                <button
                  onClick={() => setPinChangeOpen(true)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" /> Change ATM Security PIN (Current: {pin})
                </button>
              ) : (
                <form onSubmit={handleChangePin} className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-wallet-dark-card-lighter/60 border-wallet-dark-card-lighter' : 'bg-slate-100 border-slate-200'
                }`}>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">New 4-Digit PIN</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1928"
                      className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none border text-center font-mono ${
                        isDarkMode ? 'bg-wallet-dark-card border-slate-700 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-wallet-purple hover:bg-wallet-purple-hover text-white text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
