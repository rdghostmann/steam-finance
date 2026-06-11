// HomePage.tsx - The Main Dashboard of the NairaPay Finance App

"use client"

import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Headphones,
  ChevronRight,
  Eye,
  EyeOff,
  Landmark,
  Smartphone,
  PiggyBank,
  CreditCard,
  Phone,
  Wifi,
  Trophy,
  Zap,
  Gift,
  Banknote,
  LayoutGrid,
  Sun,
  Moon,
UserRound,
  ShieldCheck,

} from 'lucide-react';

// import { Transaction, AppNotification } from './types';
// import { INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS, NIGERIAN_BANKS } from './data';

// Component Imports
import TransactionHistoryModal from '@/components/TransactionHistoryModal';
import AddMoneyModal from '@/components/AddMoneyModal';
import TransferModal from '@/components/TransferModal';
import ServicesModal, { ServiceType } from '@/components/ServicesModal';
import VirtualCardModal from '@/components/VirtualCardModal';
import NotificationDrawer from '@/components/NotificationDrawer';
import YesterdayEarningsWidget from '@/components/YesterdayEarningsWidget';
import { INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS } from '@/data';
import { AppNotification, Transaction } from '@/types';

export default function Home() {

  // --- Persistent States with localStorage ---
  const [balance, setBalance] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const cached = localStorage.getItem("np_balance");
    return cached ? parseFloat(cached) : 0;
  });

  const [yesterdayEarnings, setYesterdayEarnings] = useState<number>(() => {
    if (typeof window === "undefined") return 0.02;
    const cached = localStorage.getItem("np_yesterday_earnings");
    return cached ? parseFloat(cached) : 0.02;
  });

 const [transactions, setTransactions] = useState<Transaction[]>(() => {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;

  const cached = localStorage.getItem("np_transactions");
  return cached ? JSON.parse(cached) : INITIAL_TRANSACTIONS;
});

const [notifications, setNotifications] = useState<AppNotification[]>(() => {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;

  const cached = localStorage.getItem("np_notifications");
  return cached ? JSON.parse(cached) : INITIAL_NOTIFICATIONS;
});

const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
  if (typeof window === "undefined") return true;

  const cached = localStorage.getItem("np_darkmode");
  return cached ? cached === "true" : true;
});

const [showBalance, setShowBalance] = useState<boolean>(() => {
  if (typeof window === "undefined") return true;

  const cached = localStorage.getItem("np_show_balance");
  return cached ? cached === "true" : true;
});

// --- Portfolio allocations --
const [cashboxSavings, setCashboxSavings] = useState<number>(() => {
  if (typeof window === "undefined") return 12500;

  const cached = localStorage.getItem("np_cashbox_savings");
  return cached ? parseFloat(cached) : 12500;
});

const [mutualFunds, setMutualFunds] = useState<number>(() => {
  if (typeof window === "undefined") return 48000;

  const cached = localStorage.getItem("np_mutual_funds");
  return cached ? parseFloat(cached) : 48000;
});

  // --- Modal Visibility States ---
  const [historyOpen, setHistoryOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferPreset, setTransferPreset] = useState<'bank' | 'palmpay'>('bank');

  const [servicesOpen, setServicesOpen] = useState(false);
  const [servicesPreset, setServicesPreset] = useState<ServiceType>('airtime');

  const [virtualCardOpen, setVirtualCardOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [earningsWidgetOpen, setEarningsWidgetOpen] = useState(false);

  // --- Workspace Help Alert ---

  // Sync state changes back to localStorage
  useEffect(() => {
    localStorage.setItem('np_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('np_yesterday_earnings', yesterdayEarnings.toString());
  }, [yesterdayEarnings]);

  useEffect(() => {
    localStorage.setItem('np_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('np_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('np_darkmode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('np_show_balance', showBalance.toString());
  }, [showBalance]);

  useEffect(() => {
    localStorage.setItem('np_cashbox_savings', cashboxSavings.toString());
  }, [cashboxSavings]);

  useEffect(() => {
    localStorage.setItem('np_mutual_funds', mutualFunds.toString());
  }, [mutualFunds]);

  // --- Notification Count Badge ---
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // --- Simulation triggers ---
  const triggerNotification = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `nt-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleDepositSuccess = (amount: number, methodTitle: string) => {
    const newBalance = balance + amount;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      title: `Wallet Funded via ${methodTitle}`,
      amount,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-DEP-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerNotification('Funding Successful! 💰', `Your NairaPay wallet has been credited with +₦${amount.toLocaleString()} via ${methodTitle}.`);
  };

  const handleTransferSuccess = (amount: number, recipientDetail: string, isPalmPay: boolean) => {
    const newBalance = balance - amount;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer',
      title: `Transfer ${recipientDetail}`,
      amount,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-TRF-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);

    const notifTitle = isPalmPay ? 'PalmPay Transfer Dispatched ⚡' : 'Bank Transfer Successful 🏛️';
    triggerNotification(notifTitle, `Sent ₦${amount.toLocaleString()} ${recipientDetail}. Dynamic fee: ₦0.00.`);
  };

  const handleServiceSuccess = (amount: number, description: string) => {
    const newBalance = balance - amount;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'service',
      title: description,
      amount,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-SRV-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerNotification('Utility Receipt Generated 📄', `Paid ₦${amount.toLocaleString()} for: ${description}. Access token delivered to logs.`);
  };

  const handleClaimYesterdayEarnings = (amount: number) => {
    setBalance((prev) => prev + amount);
    setYesterdayEarnings(0);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'interest',
      title: 'Spend & Save Interest Payout Claim',
      amount,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-INT-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerNotification('Naira Yield Claimed 🌟', `Claimed your yesterday return of ₦${amount.toFixed(2)} to main wallet.`);
  };

  const handleLoanGrant = (amount: number, description: string) => {
    setBalance((prev) => prev + amount);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'commission',
      title: description,
      amount,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-GEN-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerNotification('Funds Received 💰', `${description} completed successfully with instant disbursal.`);
  };

  // Claim Daily Commission Banner Reward (from N100 to N1,200)
  const handleUnlockClaimBanner = () => {
    const awards = [120, 250, 480, 850, 1050];
    const pickedReward = awards[Math.floor(Math.random() * awards.length)];

    setBalance((prev) => prev + pickedReward);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'commission',
      title: 'Banner Daily Commission Reward',
      amount: pickedReward,
      date: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'Successful',
      reference: `REF-COM-${Math.floor(Math.random() * 899999 + 100000)}-NPRY`
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerNotification('Union Bonus Claimed 🎁', `Unlocked ₦${pickedReward.toLocaleString()} on Daily Commission. Keep checking back!`);
  };

  // --- Notification Interactions ---
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const formatNaira = (amt: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amt);
  };

  const getRelativeColor = (lightClass: string, darkClass: string) => {
    return isDarkMode ? darkClass : lightClass;
  };

  // Quick Action click helper
  const handleQuickAction = (action: string) => {
    if (action === 'bank') {
      setTransferPreset('bank');
      setTransferOpen(true);
    } else if (action === 'palmpay') {
      setTransferPreset('palmpay');
      setTransferOpen(true);
    } else if (action === 'savings') {
      // open yesterday earnings for yield graphs + compound calculators!
      setEarningsWidgetOpen(true);
    } else if (action === 'card') {
      setVirtualCardOpen(true);
    }
  };

  // Services quick grid trigger
  const handleServiceClick = (serv: ServiceType) => {
    setServicesPreset(serv);
    setServicesOpen(true);
  };

  return (
    <div className={`min-h-screen py-6 px-4 md:px-8 transition-colors duration-300 font-sans  ${getRelativeColor(
      'bg-slate-200 border-slate-300 shadow-slate-100',
      'bg-[#1F1B2C] border-[#2C2640] shadow-slate-950/20'
    )
      }`}>

      {/* Main Responsive Grid Layout */}
      <div className="w-full z-10">



        {/* CENTER COLUMN: The Sleek Mobile Device Frame (Resilient & fully functional) */}
        <div className="">

          {/* Mobilizer Screen Wrapper */}
          <div className={`w-full relative transition-all shadow-2xl ${getRelativeColor(
            'bg-slate-200 border-slate-300 shadow-slate-100',
            'bg-[#1F1B2C] border-[#2C2640] shadow-slate-950/20'
          )
            }`}>



            {/* Simulated Active Application */}
            <div className={`w-full rounded-[2.5rem] px-5 pt-8 pb-6 overflow-hidden min-h-1 flex flex-col justify-between transition-colors duration-300 ${getRelativeColor(
              'bg-slate-200 border-slate-300 shadow-slate-100',
              'bg-[#1F1B2C] border-[#2C2640] shadow-slate-950/20'
            )}`}>

              {/* STAGE A: HEADER BAR */}
              <div className="flex justify-between items-center mt-3">

                {/* Profile Pic & Welcome */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-violet-600 border border-violet-400 flex items-center justify-center shadow">
                   <UserRound className="" />
                  </div>
                  <div>
                    <h2 className="font-display font-medium text-xs text-slate-400">Hi, FRIDAY</h2>
                  </div>
                </div>

                {/* Topbar Operations Trigger */}
                <div className="flex items-center gap-4">
                  {/* Global Mode Toggle inside TopBar with beautiful micro feedback */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`hidden p-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer ${getRelativeColor('bg-slate-100 border-slate-200 text-slate-600', 'bg-wallet-dark-card border-wallet-dark-card-lighter text-slate-200')
                      }`}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-500" />}
                  </button>

                  <button
                    onClick={() => {}}
                    // onClick={() => handleQuickAction('savings')}
                    className={`p-1 hover:scale-110 active:scale-90 transition-transform cursor-pointer ${getRelativeColor('text-slate-600', 'text-white')}`}
                  >
                    <Headphones className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {}}
                    // onClick={() => setNotificationsOpen(true)}
                    className="relative p-1 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Bell className={`w-5 h-5 ${getRelativeColor('text-slate-600', 'text-white')}`} />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1 text-[8px] bg-red-500 text-white font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        99+
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* STAGE B: AVAILABLE BALANCE CARD */}
              <div className="mt-4">
                <div className="rounded-3xl p-5 bg-wallet-purple text-white relative overflow-hidden shadow-lg shadow-wallet-purple/10">
                  {/* Decorative background vectors */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12 blur-xl pointer-events-none" />
                  <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12 blur-lg pointer-events-none" />

                  {/* Top line */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowBalance(!showBalance)}>
                      <div className="w-2 h-2 rounded-full bg-wallet-green animate-ping" />
                      <span className="text-[11px] font-bold text-wallet-green/90 uppercase tracking-widest flex items-center gap-1">
                        Available Balance
                      </span>
                      {showBalance ? <Eye className="w-3.5 h-3.5 text-white/70" /> : <EyeOff className="w-3.5 h-3.5 text-white/70" />}
                    </div>

                    <button
                      onClick={() => setHistoryOpen(true)}
                      className="text-[10px] text-white/90 hover:underline font-bold flex items-center gap-0.5 tracking-wider uppercase"
                    >
                      Transaction History <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Main Value display */}
                  <div className="mt-3 flex justify-between items-center">
                    <h3 className="text-2xl font-bold font-display tracking-tight shrink-0 select-all">
                      {showBalance ? formatNaira(balance) : '₦ •••• ••••'}
                    </h3>

                    <button
                      onClick={() => setAddMoneyOpen(true)}
                      className="px-4 py-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full text-xs font-bold transition-all border border-white/20 active:scale-95 shadow shrink-0"
                    >
                      Add Money
                    </button>
                  </div>
                </div>

                {/* YESTERDAY'S EARNINGS ATTACHED BAR */}
                <div
                  onClick={() => setEarningsWidgetOpen(true)}
                  className={`my-5 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors hover:bg-opacity-80 absolute-z ${getRelativeColor('bg-purple-950/90 text-white', 'bg-wallet-dark-card-lighter text-white border border-wallet-dark-card-lighter')
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-wallet-purple/20 rounded-md text-[10px] flex items-center justify-center font-bold">₦</span>
                    <span className="text-[11px] font-bold tracking-tight">
                      Yesterday&apos; Earnings: <span className="text-wallet-green font-mono">+{formatNaira(yesterdayEarnings)}</span> <span className="opacity-60 font-semibold">(Updating)</span>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </div>
              </div>

              {/* STAGE C: QUICK ACTION SEGMENT BUTTONS */}
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { id: 'bank', label: 'To Bank', sub: '0 fee', isHot: true },
                  { id: 'palmpay', label: 'To PalmPay' },
                  { id: 'savings', label: 'Savings' },
                  { id: 'card', label: 'ATM Card' }
                ].map((act) => {
                  const getIcon = (id: string) => {
                    switch (id) {
                      case 'bank': return <Landmark className="w-5 h-5 text-violet-400" />;
                      case 'palmpay': return <Smartphone className="w-5 h-5 text-violet-400" />;
                      case 'savings': return <PiggyBank className="w-5 h-5 text-violet-400" />;
                      default: return <CreditCard className="w-5 h-5 text-violet-400" />;
                    }
                  };
                  return (
                    <button
                      key={act.id}
                      // onClick={() => { }}
                      onClick={() => handleQuickAction(act.id)}
                      className={`p-3 rounded-2xl bg-opacity-70 transition-all hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95 cursor-pointer flex flex-col items-center relative text-center justify-center ${getRelativeColor(
                        'bg-white border border-slate-200/50 shadow-sm text-slate-800',
                        'bg-wallet-dark-card hover:bg-wallet-dark-card-lighter text-white'
                      )
                        }`}
                    >
                      {act.isHot && (
                        <span className="absolute -top-1.5 -right-1 text-[8px] bg-red-500 font-bold text-white px-1.5 py-0.5 rounded-full scale-90">
                          0 fee
                        </span>
                      )}
                      <div className={`p-2 rounded-xl mb-1.5 ${getRelativeColor('bg-slate-50', 'bg-wallet-dark')}`}>
                        {getIcon(act.id)}
                      </div>
                      <span className="text-[10px] font-bold leading-tight select-none">
                        {act.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* STAGE D: SPEND & SAVE CAROUSEL PANEL */}
              <div
                onClick={() => {}}
                // onClick={() => setEarningsWidgetOpen(true)}
                className={`mt-3.5 p-4 rounded-3xl cursor-pointer transition-all border flex justify-between items-center ${getRelativeColor(
                  'bg-white border-slate-200/60 shadow-sm hover:border-slate-300',
                  'bg-wallet-dark-card border-wallet-dark-card-lighter hover:bg-wallet-dark-card-lighter'
                )
                  }`}
              >
                <div>
                  <h4 className="font-display font-bold text-[12px] uppercase tracking-wider text-slate-500 leading-tight">
                    Spend & Save Interest
                  </h4>
                  <p className={`text-xs font-bold mt-1 ${getRelativeColor('text-slate-800', 'text-white')}`}>
                    ₦0.02 Interest Payout
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">Today 6:49 AM</span>
                  <span className="text-[9px] bg-wallet-purple/10 text-wallet-purple font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">
                    Credited
                  </span>
                </div>
              </div>

              {/* STAGE E: SERVICES INSTANT UTILITY GRID */}
              <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                {[
                  { id: 'airtime', label: 'Airtime', iconColor: 'text-indigo-400 bg-indigo-500/10' },
                  { id: 'data', label: 'Data', isFree: true, iconColor: 'text-emerald-400 bg-emerald-500/10' },
                  { id: 'betting', label: 'Betting', iconColor: 'text-cyan-400 bg-cyan-500/10' },
                  { id: 'electricity', label: 'Electricity', iconColor: 'text-amber-500 bg-amber-500/10' },
                  { id: 'refer', label: 'Refer & Earn', iconColor: 'text-rose-400 bg-rose-500/10' },
                  { id: 'insurance', label: 'Insurance', iconColor: 'text-sky-400 bg-sky-500/10' },
                  { id: 'loan', label: 'Loan', iconColor: 'text-purple-400 bg-purple-500/10' },
                  { id: 'more', label: 'More', iconColor: 'text-zinc-400 bg-zinc-500/10' }
                ].map((serv) => {
                  const getServiceIcon = (id: string) => {
                    switch (id) {
                      case 'airtime': return <Phone className="w-4 h-4" />;
                      case 'data': return <Wifi className="w-4 h-4" />;
                      case 'betting': return <Trophy className="w-4 h-4" />;
                      case 'electricity': return <Zap className="w-4 h-4" />;
                      case 'refer': return <Gift className="w-4 h-4" />;
                      case 'insurance': return <ShieldCheck className="w-4 h-4" />;
                      case 'loan': return <Banknote className="w-4 h-4 animate-pulse" />;
                      default: return <LayoutGrid className="w-4 h-4" />;
                    }
                  };
                  return (
                    <div
                      key={serv.id}
                      onClick={() => { }}
                      // onClick={() => handleServiceClick(serv.id as ServiceType)}
                      className={`p-2 py-3 rounded-2xl cursor-pointer text-center flex flex-col items-center justify-center transition-all hover:scale-105 hover:bg-opacity-80 select-none relative ${getRelativeColor(
                        'bg-white border border-slate-200/50 shadow-sm text-slate-800',
                        'bg-wallet-dark-card text-white hover:bg-wallet-dark-card-lighter'
                      )
                        }`}
                    >
                      {serv.isFree && (
                        <span className="absolute -top-1.5 right-1 text-[7px] bg-emerald-500 text-white font-bold px-1 py-0.5 rounded-full tracking-wider leading-none scale-90">
                          FREE
                        </span>
                      )}

                      <div className={`p-2 rounded-xl mb-1.5 ${serv.iconColor}`}>
                        {getServiceIcon(serv.id)}
                      </div>

                      <span className="text-[9px] font-bold leading-tight truncate w-full">
                        {serv.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* STAGE F: DAILY COMMISSION REWARD BANNER */}
              <div className={`mt-3.5 p-4 rounded-3xl relative overflow-hidden flex items-center justify-between ${getRelativeColor('bg-[#FFF8F2] border border-[#FFE7D1]', 'bg-wallet-dark-card border border-wallet-dark-card-lighter')
                }`}>
                {/* Visual Accent */}
                <div className="absolute right-0 bottom-0 top-0 w-24 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                    <Gift className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-display font-extrabold text-[12px] text-slate-200 uppercase leading-none md:text-white">
                      Daily ₦100+ Commission
                    </h5>
                    <p className={`text-[10px] mt-1 ${getRelativeColor('text-slate-600', 'text-slate-400')}`}>
                      Receive More, Earn More
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleUnlockClaimBanner}
                  className="px-4.5 py-1.5 bg-wallet-purple hover:bg-wallet-purple-hover text-white text-[10px] font-extrabold rounded-full transition-transform active:scale-95 shadow shrink-0 cursor-pointer"
                >
                  Unlock
                </button>
              </div>

              {/* STAGE G: BOTTOM INVESTMENT/SAVINGS CONTAINER CARDS */}
              <div className="grid grid-cols-2 gap-2.5 mt-3.5">

                {/* CashBox Card */}
                <div
                  onClick={() => { }}
                  // onClick={() => setEarningsWidgetOpen(true)}
                  className={`p-4 rounded-[1.8rem] relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01] border ${getRelativeColor(
                    'bg-white border-slate-200/60 shadow-sm',
                    'bg-wallet-dark-card border-wallet-dark-card-lighter'
                  )
                    }`}
                >
                  <h4 className="font-display font-medium text-xs text-wallet-purple leading-tight">CashBox</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1.5 line-clamp-2">
                    Your Available Balance, Earning for You Daily!
                  </p>

                  <div className="mt-3">
                    <span className="text-xl font-bold font-display text-wallet-green">20.00%</span>
                    <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">Maximum Annual Yield</span>
                  </div>
                </div>

                {/* Mutual Funds Card */}
                <div
                  onClick={() => { }}
                  // onClick={() => setEarningsWidgetOpen(true)}
                  className={`p-4 rounded-[1.8rem] relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01] border ${getRelativeColor(
                    'bg-white border-slate-200/60 shadow-sm',
                    'bg-wallet-dark-card border-wallet-dark-card-lighter'
                  )
                    }`}
                >
                  {/* Diagonal top badge */}
                  <div className="absolute -right-8 top-5 bg-amber-500 text-white font-black text-[7px] py-[3px] px-18 rotate-[30deg] translate-x-3 translate-y-1 block tracking-widest scale-95 uppercase">
                    TOP PICK
                  </div>

                  <h4 className="font-display font-medium text-xs text-violet-400 leading-tight">Mutual Funds</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1.5 line-clamp-2">
                    Grow your Money while you go!
                  </p>

                  <div className="mt-3">
                    <span className="text-xl font-bold font-display text-wallet-green">101.19%</span>
                    <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">Maximum Annual Yield</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>


      </div>

      {/* --- FLOATING NOTIFICATION BANNER / MOCK INSTRUCTIONS (TOP HEADER) --- */}
      {/* {showTutorialAlert && (
        <div className="fixed bottom-4 left-4 z-40 max-w-sm p-4 bg-wallet-purple text-white rounded-2xl shadow-xl flex gap-3 items-start justify-between border border-white/20 animate-slide-up">
          <div className="flex gap-2">
            <Sparkles className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
            <div>
              <h4 className="font-bold text-xs">Simulate Everything Live!</h4>
              <p className="text-[10px] opacity-90 mt-1">
                Click <q>Add Money</q>, transfer to friends with <g>Other Banks</g>, recharge airtime, or unlock daily rewards. Use the **Left controls panel** on desktop screens!
              </p>
            </div>
          </div>
          <button onClick={() => setShowTutorialAlert(false)} className="text-white/80 hover:text-white font-bold text-xs p-1">
            ✕
          </button>
        </div>
      )} */}

      {/* --- ALL IN APP MODALS --- */}

      {/* 1. Transaction History Modal */}
      <TransactionHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        transactions={transactions}
        isDarkMode={isDarkMode}
        onClearHistory={() => setTransactions([])}
      />

      {/* 2. Add Money / Wallet Funding Modal */}
      <AddMoneyModal
        isOpen={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        isDarkMode={isDarkMode}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* 3. Send Transfer Modal */}
      <TransferModal
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        availableBalance={balance}
        onTransferSuccess={handleTransferSuccess}
        isDarkMode={isDarkMode}
        presetTarget={transferPreset}
      />

      {/* 4. Pay Utility Bills / Micro Capital Loans Modal */}
      <ServicesModal
        isOpen={servicesOpen}
        onClose={() => setServicesOpen(false)}
        serviceType={servicesPreset}
        availableBalance={balance}
        onServicePaymentSuccess={handleServiceSuccess}
        onLoanInterestGrant={handleLoanGrant}
        isDarkMode={isDarkMode}
      />

      {/* 5. Virtual Master ATM Card Modal */}
      <VirtualCardModal
        isOpen={virtualCardOpen}
        onClose={() => setVirtualCardOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* 6. Alert System Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsAsRead}
        onClearAll={handleClearAllNotifications}
        onNotificationClick={handleNotificationClick}
        isDarkMode={isDarkMode}
      />

      {/* 7. Savings Compound Simulator Drawer */}
      <YesterdayEarningsWidget
        isOpen={earningsWidgetOpen}
        onClose={() => setEarningsWidgetOpen(false)}
        yesterdayEarnings={yesterdayEarnings}
        availableBalance={balance}
        onClaimInterest={handleClaimYesterdayEarnings}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
