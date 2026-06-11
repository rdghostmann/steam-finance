import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Wifi, Trophy, Zap, Gift, ShieldAlert, Banknote, HelpCircle, Check, Copy, Sparkles, Send, Coins } from 'lucide-react';
import { TELECOM_PROVIDERS, DATA_PLANS, BETTER_LIST, ELECTRICITY_PROVIDERS } from '@/data';

export type ServiceType = 'airtime' | 'data' | 'betting' | 'electricity' | 'refer' | 'insurance' | 'loan' | 'more';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  availableBalance: number;
  onServicePaymentSuccess: (amount: number, description: string) => void;
  onLoanInterestGrant: (amount: number, description: string) => void;
  isDarkMode: boolean;
}

export default function ServicesModal({
  isOpen,
  onClose,
  serviceType,
  availableBalance,
  onServicePaymentSuccess,
  onLoanInterestGrant,
  isDarkMode
}: ServicesModalProps) {
  const [activeTab, setActiveTab] = useState<ServiceType>(serviceType);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local fields
  const [phoneNo, setPhoneNo] = useState('08031234567');
  const [telecom, setTelecom] = useState('MTN');
  const [airtimeAmt, setAirtimeAmt] = useState('500');
  
  const [selectedDataPlan, setSelectedDataPlan] = useState<string>(DATA_PLANS[0].id);
  const [bettingPlatform, setBettingPlatform] = useState<string>(BETTER_LIST[0].name);
  const [bettingId, setBettingId] = useState('983410294');
  const [bettingAmt, setBettingAmt] = useState('1000');

  const [meterNo, setMeterNo] = useState('54102930491');
  const [electricityProvider, setElectricityProvider] = useState<string>(ELECTRICITY_PROVIDERS[0].name);
  const [electricityAmt, setElectricityAmt] = useState('2000');

  const [loanAmount, setLoanAmount] = useState('50000');
  const [loanMonths, setLoanMonths] = useState(6);

  const [insurancePlan, setInsurancePlan] = useState('Personal Accident Cover (₦1,200/yr)');
  
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(serviceType);
      setSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen, serviceType]);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://nairapay.com/signup?ref=RANDAL99');
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  const handleSimulateReferralClaim = () => {
    // Simulate inviting a friend
    onLoanInterestGrant(500, 'Referral Bonus: Friend Joined!');
    setSuccessMessage('Referral simulation triggered! ₦500.00 cash bonus credited to your main balance!');
    setSuccess(true);
  };

  const handleBuyAirtime = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const amt = parseFloat(airtimeAmt);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid airtime amount.');
      return;
    }
    if (amt > availableBalance) {
      setErrorMsg(`Insufficient funds to buy Airtime (Balance: ₦${availableBalance.toLocaleString()})`);
      return;
    }

    onServicePaymentSuccess(amt, `${telecom} Airtime Purchase (${phoneNo})`);
    setSuccessMessage(`Airtime recharge of ₦${amt.toLocaleString()} to ${phoneNo} was successful. Token sent via text.`);
    setSuccess(true);
  };

  const handleBuyData = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const plan = DATA_PLANS.find(p => p.id === selectedDataPlan);
    if (!plan) return;

    if (plan.price > availableBalance) {
      setErrorMsg(`Insufficient funds to purchase ${plan.size} Data bundle.`);
      return;
    }

    onServicePaymentSuccess(plan.price, `${plan.provider} Data Recharge (${plan.size})`);
    setSuccessMessage(`Data subscription of ${plan.size} for ${plan.provider} active on ${phoneNo}. Price: ₦${plan.price}`);
    setSuccess(true);
  };

  const handleBettingDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const amt = parseFloat(bettingAmt);
    if (isNaN(amt) || amt <= 0) return;

    if (amt > availableBalance) {
      setErrorMsg(`Insufficient funds to deposit to ${bettingPlatform}`);
      return;
    }

    onServicePaymentSuccess(amt, `Fund ${bettingPlatform} (User: ${bettingId})`);
    setSuccessMessage(`Successfully funded your ${bettingPlatform} wallet with ₦${amt.toLocaleString()}. Ref ID: BET-${Math.floor(Math.random()*900000+100000)}`);
    setSuccess(true);
  };

  const handleElectricityPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const amt = parseFloat(electricityAmt);
    if (isNaN(amt) || amt <= 0) return;

    if (amt > availableBalance) {
      setErrorMsg('Insufficient balance for utility payment.');
      return;
    }

    onServicePaymentSuccess(amt, `Electricity Recharge Token (${electricityProvider})`);
    const generatedToken = `${Math.floor(Math.random()*8999+1000)}-${Math.floor(Math.random()*8999+1000)}-${Math.floor(Math.random()*8999+1000)}`;
    setSuccessMessage(`Prepaid Electric Token generated! Meter: ${meterNo}. Token code: ${generatedToken}`);
    setSuccess(true);
  };

  const handleLoanDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const amt = parseFloat(loanAmount);
    if (isNaN(amt) || amt <= 0) return;

    onLoanInterestGrant(amt, 'InstaLoan Disbursal Approved');
    setSuccessMessage(`Instant Cash Loan Approved! ₦${amt.toLocaleString()} disbursed straight to your Wallet balance. Monthly repaid interest is set under 4% APR.`);
    setSuccess(true);
  };

  const handleBuyInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    const price = insurancePlan.includes('All-Risk') ? 5000 : 1200;

    if (price > availableBalance) {
      setErrorMsg('Insufficient funds for yearly insurance enrollment');
      return;
    }

    onServicePaymentSuccess(price, `NairaPay Shield: ${insurancePlan}`);
    setSuccessMessage(`Insurance enrollment configured successfully. You are protected. Policy certificate dispatched to RANDAL@gmail.com.`);
    setSuccess(true);
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

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-300 ${
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
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <span>Pay Bills & Utilities</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Explore instantly-processed bills & reward programs
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

            {/* Quick service navigation tabs */}
            <div className={`flex gap-2 p-2 overflow-x-auto whitespace-nowrap border-b ${
              isDarkMode ? 'bg-wallet-dark-card/30 border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
            }`}>
              {[
                { type: 'airtime', icon: <Phone className="w-3.5 h-3.5" />, label: 'Airtime' },
                { type: 'data', icon: <Wifi className="w-3.5 h-3.5" />, label: 'Data Bundle' },
                { type: 'betting', icon: <Trophy className="w-3.5 h-3.5" />, label: 'Betting' },
                { type: 'electricity', icon: <Zap className="w-3.5 h-3.5" />, label: 'Electricity' },
                { type: 'refer', icon: <Gift className="w-3.5 h-3.5 text-rose-400" />, label: 'Refer & Earn' },
                { type: 'insurance', icon: <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />, label: 'Insurance' },
                { type: 'loan', icon: <Banknote className="w-3.5 h-3.5 text-amber-500 animate-pulse" />, label: 'InstaLoan' },
              ].map((tab) => (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.type as ServiceType);
                    setSuccess(false);
                    setErrorMsg('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.type
                      ? 'bg-wallet-purple text-white shadow font-semibold'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error notifications block */}
            {errorMsg && !success && (
              <div className="mx-6 mt-4 p-3.5 text-xs rounded-xl bg-red-500/15 border border-red-500/25 text-red-500">
                <p className="font-semibold text-center">{errorMsg}</p>
              </div>
            )}

            {/* Simulated Content views */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {success ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-wallet-green/10 text-wallet-green rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Check className="w-10 h-10" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-wallet-green">Action Succeeded!</h4>
                  <p className={`text-sm max-w-sm mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {successMessage}
                  </p>
                  
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setSuccess(false)}
                      className={`flex-1 py-3 text-xs font-bold rounded-xl outline-none transition ${
                        isDarkMode ? 'bg-wallet-dark-card hover:bg-wallet-dark-card-lighter' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      Another Bill
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-wallet-purple text-white text-xs font-bold rounded-xl hover:bg-wallet-purple-hover shadow-md transition"
                    >
                      Return to App
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Form Options */
                <div>
                  {activeTab === 'airtime' && (
                    <form onSubmit={handleBuyAirtime} className="space-y-4">
                      {/* Carrier selector */}
                      <div className="grid grid-cols-4 gap-2">
                        {TELECOM_PROVIDERS.map((cur) => (
                          <button
                            type="button"
                            key={cur.name}
                            onClick={() => setTelecom(cur.name)}
                            className={`p-2 rounded-xl text-center border-2 transition flex flex-col justify-center items-center gap-1 ${
                              telecom === cur.name
                                ? 'border-wallet-purple bg-wallet-purple/10'
                                : isDarkMode ? 'border-wallet-dark-card-lighter bg-wallet-dark-card' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: cur.color, color: '#000' }}>
                              {cur.name[0]}
                            </span>
                            <span className="text-[10px] font-bold">{cur.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number</label>
                          <input
                            type="text"
                            maxLength={11}
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                            placeholder="08031234567"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border font-mono ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Recharge Amount (₦)</label>
                          <input
                            type="number"
                            value={airtimeAmt}
                            onChange={(e) => setAirtimeAmt(e.target.value)}
                            placeholder="Recharge limit"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-wallet-purple text-white font-bold rounded-xl text-xs hover:bg-wallet-purple-hover"
                      >
                        Buy {telecom} Airtime
                      </button>
                    </form>
                  )}

                  {activeTab === 'data' && (
                    <form onSubmit={handleBuyData} className="space-y-4">
                      {/* Carrier selector reuse */}
                      <div className="grid grid-cols-4 gap-2">
                        {TELECOM_PROVIDERS.map((cur) => (
                          <button
                            type="button"
                            key={cur.name}
                            onClick={() => {
                              setTelecom(cur.name);
                              // Auto select first matching package
                              const match = DATA_PLANS.find(p => p.provider === cur.name);
                              if (match) setSelectedDataPlan(match.id);
                            }}
                            className={`p-2 rounded-xl text-center border-2 transition flex flex-col justify-center items-center gap-1 ${
                              telecom === cur.name
                                ? 'border-wallet-purple bg-wallet-purple/10'
                                : isDarkMode ? 'border-wallet-dark-card-lighter bg-wallet-dark-card' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: cur.color, color: '#000' }}>
                              {cur.name[0]}
                            </span>
                            <span className="text-[10px] font-bold">{cur.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number</label>
                          <input
                            type="text"
                            maxLength={11}
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            placeholder="08031234567"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border font-mono ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-18 block">Select Bundle Package (with promotional rebate)</label>
                          <div className="space-y-2 mt-1">
                            {DATA_PLANS.filter(p => p.provider === telecom).map((plan) => (
                              <div
                                key={plan.id}
                                onClick={() => setSelectedDataPlan(plan.id)}
                                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                  selectedDataPlan === plan.id
                                    ? 'border-wallet-purple bg-wallet-purple/5'
                                    : isDarkMode ? 'border-wallet-dark-card-lighter hover:border-slate-700 bg-wallet-dark-card' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-wallet-green animate-ping" />
                                  <div>
                                    <span className="font-bold text-sm block">{plan.size} Bundle</span>
                                    <span className="text-[10px] text-slate-500">Validity: {plan.validity}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-wallet-purple text-sm">₦{plan.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-wallet-purple text-white font-bold rounded-xl text-xs hover:bg-wallet-purple-hover"
                      >
                        Subscribe Active Data Bundle
                      </button>
                    </form>
                  )}

                  {activeTab === 'betting' && (
                    <form onSubmit={handleBettingDeposit} className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Gaming Provider</label>
                        <select
                          value={bettingPlatform}
                          onChange={(e) => setBettingPlatform(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border ${
                            isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {BETTER_LIST.map(v => (
                            <option key={v.name} value={v.name}>{v.name} ({v.rating})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">User Account/ID</label>
                          <input
                            type="text"
                            value={bettingId}
                            onChange={(e) => setBettingId(e.target.value)}
                            placeholder="Bet ID"
                            className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Deposit Amount (₦)</label>
                          <input
                            type="number"
                            value={bettingAmt}
                            onChange={(e) => setBettingAmt(e.target.value)}
                            placeholder="Min ₦100"
                            className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-wallet-purple text-white font-bold rounded-xl text-xs hover:bg-wallet-purple-hover"
                      >
                        Fund {bettingPlatform} Account
                      </button>
                    </form>
                  )}

                  {activeTab === 'electricity' && (
                    <form onSubmit={handleElectricityPayment} className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 font-semibold mb-1 block">Distribution Disco Company</label>
                        <select
                          value={electricityProvider}
                          onChange={(e) => setElectricityProvider(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border ${
                            isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter text-white' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {ELECTRICITY_PROVIDERS.map(v => (
                            <option key={v.name} value={v.name}>{v.name} - {v.region}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Prepaid Meter Number</label>
                          <input
                            type="text"
                            maxLength={11}
                            value={meterNo}
                            onChange={(e) => setMeterNo(e.target.value.replace(/\D/g, ''))}
                            placeholder="Meter Number"
                            className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border font-mono ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold mb-1 block">Token Value (₦)</label>
                          <input
                            type="number"
                            value={electricityAmt}
                            onChange={(e) => setElectricityAmt(e.target.value)}
                            placeholder="Electricity units cost"
                            className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border ${
                              isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-200'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-wallet-purple text-white font-bold rounded-xl text-xs hover:bg-wallet-purple-hover"
                      >
                        Generate Utility Prepaid Token
                      </button>
                    </form>
                  )}

                  {activeTab === 'refer' && (
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <Gift className="w-6 h-6 animate-spin" />
                      </div>
                      <h4 className="font-bold text-base">Invite Friends & Earn Commission</h4>
                      <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Copy your personalized link. When your referral funds their wallet with at least ₦1,000, both of you instantly score a <span className="font-bold text-wallet-purple">₦500.00 cash bonus!</span>
                      </p>

                      <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <span className="font-mono text-xs text-slate-400 select-all truncate">https://nairapay.com/ref=RANDAL99</span>
                        <button
                          onClick={handleCopyReferral}
                          className="px-3.5 py-1.5 bg-wallet-purple text-white text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1"
                        >
                          {copiedLink ? 'Copied' : 'Copy link'}
                        </button>
                      </div>

                      <div className={`p-4 rounded-2xl border text-left flex flex-col gap-3 ${
                        isDarkMode ? 'bg-wallet-dark-card-lighter border-wallet-dark-card-lighter' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-400">Mock Invitations Joined</span>
                          <span className="font-bold text-wallet-purple">12 Friends</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-400">Total Refer Bonus Earned</span>
                          <span className="font-mono font-bold text-emerald-500">₦6,000.00</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSimulateReferralClaim}
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" /> Simulate active friend sign up (+₦500)
                      </button>
                    </div>
                  )}

                  {activeTab === 'insurance' && (
                    <form onSubmit={handleBuyInsurance} className="space-y-4">
                      <div className="text-center space-y-1 mb-2">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                          <ShieldAlert className="w-6 h-6 text-wallet-green" />
                        </div>
                        <h4 className="font-bold text-base">NairaPay Shield Assurances</h4>
                        <p className="text-[10px] text-slate-500">Powered by Leadway Assurance PLC</p>
                      </div>

                      <div className="space-y-2">
                        {[
                          { title: 'Personal Accident Cover (₦1,200/yr)', desc: 'Up to ₦500,000 emergency medical payout across active hospital channels in Nigeria.' },
                          { title: 'All-Risk Smartphone Shield (₦5,000/yr)', desc: 'Repair and replacement support for cracked screens or theft logs immediately.' }
                        ].map((p) => (
                          <div
                            key={p.title}
                            onClick={() => setInsurancePlan(p.title)}
                            className={`p-3 rounded-xl border cursor-pointer text-left transition ${
                              insurancePlan === p.title
                                ? 'border-wallet-purple bg-wallet-purple/5'
                                : isDarkMode ? 'border-wallet-dark-card-lighter bg-wallet-dark-card hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <span className="font-bold text-xs block">{p.title}</span>
                            <span className="text-[10px] text-slate-500 leading-relaxed mt-0.5 block">{p.desc}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-wallet-purple text-white font-bold rounded-xl text-xs hover:bg-wallet-purple-hover"
                      >
                        Instantiate Shield Protection Policy
                      </button>
                    </form>
                  )}

                  {activeTab === 'loan' && (
                    <form onSubmit={handleLoanDisburse} className="space-y-4">
                      <div className="text-center space-y-1">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Banknote className="w-6 h-6 text-amber-500 animate-pulse" />
                        </div>
                        <h4 className="font-bold text-base">Instant Cash Disbursal Loan</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Apply for quick commercial capital. Approved immediately, 0 security or paperwork required.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold flex justify-between">
                            <span>Request Capital</span>
                            <span className="font-bold text-wallet-purple font-mono">₦{parseInt(loanAmount).toLocaleString()}</span>
                          </label>
                          <input
                            type="range"
                            min="10000"
                            max="150000"
                            step="5000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            className="w-full accent-wallet-purple cursor-pointer mt-1"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                            <span>₦10,000</span>
                            <span>₦75,000</span>
                            <span>₦150,000</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[3, 6, 12].map((m) => (
                            <button
                              type="button"
                              key={m}
                              onClick={() => setLoanMonths(m)}
                              className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                                loanMonths === m
                                  ? 'bg-wallet-purple text-white border-wallet-purple'
                                  : isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              {m} Months
                            </button>
                          ))}
                        </div>

                        <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                          isDarkMode ? 'bg-wallet-dark-card border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Interest Rate</span>
                            <span className="font-bold text-slate-400">4.5% Monthly</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Monthly Installment</span>
                            <span className="font-bold text-wallet-purple font-mono">
                              ₦{Math.ceil((parseInt(loanAmount) / loanMonths) * 1.045).toLocaleString()}/mo
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-wallet-purple text-white font-bold rounded-xl text-xs shadow-md shadow-wallet-purple/10 hover:bg-wallet-purple-hover"
                      >
                        Approve & Disburse Capital Now
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
