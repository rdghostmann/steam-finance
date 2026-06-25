import { Transaction, AppNotification, Bank } from './types';

export const NIGERIAN_BANKS: Bank[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'Guaranty Trust Bank (GTB)', code: '058' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Wema Bank (ALAT)', code: '094' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Opay (Digital Bank)', code: '999992' },
  { name: 'Kuda Bank', code: '50211' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'interest',
    title: 'Spend & Save Interest Payout',
    amount: 0.02,
    date: 'Today 6:49 AM',
    status: 'Successful',
    reference: 'REF-TXN-9840291-INT'
  },
  {
    id: 'tx-2',
    type: 'commission',
    title: 'Daily Action Reward Commission',
    amount: 150.00,
    date: 'Yesterday 4:12 PM',
    status: 'Successful',
    reference: 'REF-TXN-7640391-COM'
  },
  {
    id: 'tx-3',
    type: 'transfer',
    title: 'Transfer to Adebayo Seyi (Access Bank)',
    amount: 5000.00,
    fee: 0,
    date: 'Yesterday 10:30 AM',
    status: 'Successful',

    reference: 'REF-TXN-3820291-BNK',

    recipientName: 'ADEBAYO SEYI',
    recipientBank: 'Access Bank',
    recipientAccount: '0123456789',

    bankLogo: '/banks/access.png',

    transactionId: 'ab3k82m9xq4r1',
    sessionId: '123456789012345678901234567890',

    paymentType: 'Money Transfer - MMO',
    paymentMethod: 'PalmPay Balance',
  },
  {
    id: 'tx-4',
    type: 'airtime',
    title: 'MTN Airtime Recharge (08031234567)',
    amount: 500.00,
    date: '09 Jun 2026 8:15 PM',
    status: 'Successful',
    reference: 'REF-TXN-5012391-ART'
  },
  {
    id: 'tx-5',
    type: 'deposit',
    title: 'Wallet Funded (Card Deposit)',
    amount: 10000.00,
    date: '08 Jun 2026 11:22 AM',
    status: 'Successful',
    reference: 'REF-TXN-1049281-DEP'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'nt-1',
    title: '₦0.02 Interest Deposited!',
    message: 'Your Spend & Save interest was successfully credited. Turn on auto-invest to maximize dynamic annual yield!',
    time: 'Today 6:49 AM',
    read: false
  },
  {
    id: 'nt-2',
    title: 'Promotion Reward Available 🎁',
    message: 'Congratulations, Randal! You have a pending daily commission of over ₦100 waiting. Click "Unlock" on the banner to claim it.',
    time: 'Today 9:00 AM',
    read: false
  },
  {
    id: 'nt-3',
    title: 'Virtual Card Activated',
    message: 'Your virtual Naira Master Debit Card is active and ready for online spending with zero transaction fees!',
    time: 'Yesterday 10:00 AM',
    read: false
  },
  {
    id: 'nt-4',
    title: 'Security Alert: Password Unchanged',
    message: 'Keep your fund wallet secure by changing your 4-digit Transaction PIN regular. Tap here to manage credentials.',
    time: '2 days ago',
    read: false
  }
];

export const TELECOM_PROVIDERS = [
  { name: 'MTN', logo: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&h=80&fit=crop&q=80', color: '#FFCC00' },
  { name: 'Airtel', logo: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&h=80&fit=crop&q=80', color: '#E11D48' },
  { name: 'Glo', logo: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&h=80&fit=crop&q=80', color: '#16A34A' },
  { name: '9mobile', logo: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&h=80&fit=crop&q=80', color: '#14532D' }
];

export const DATA_PLANS = [
  { id: 'dp-1', provider: 'MTN', size: '1.5 GB', price: 500, validity: '30 Days' },
  { id: 'dp-2', provider: 'MTN', size: '3.0 GB', price: 1000, validity: '30 Days' },
  { id: 'dp-3', provider: 'MTN', size: '10 GB', price: 3000, validity: '30 Days' },
  { id: 'dp-4', provider: 'Airtel', size: '1.5 GB', price: 500, validity: '30 Days' },
  { id: 'dp-5', provider: 'Airtel', size: '5.0 GB', price: 1500, validity: '30 Days' },
  { id: 'dp-6', provider: 'Glo', size: '2.5 GB', price: 500, validity: '30 Days' },
  { id: 'dp-7', provider: 'Glo', size: '5.8 GB', price: 1000, validity: '30 Days' },
  { id: 'dp-8', provider: '9mobile', size: '2.0 GB', price: 500, validity: '30 Days' }
];

export const BETTER_LIST = [
  { name: 'Bet9ja', rating: 'Popular' },
  { name: 'SportyBet', rating: 'Instant Payout' },
  { name: '1xBet', rating: 'High Odds' },
  { name: 'Betway', rating: 'Global Brand' },
  { name: 'Merrybet', rating: 'Classic choice' }
];

export const ELECTRICITY_PROVIDERS = [
  { name: 'Ikeja Electric (IKEDC)', region: 'Lagos Mainland' },
  { name: 'Eko Electricity (EKEDC)', region: 'Lagos Island & Lekki' },
  { name: 'Abuja Electricity (AEDC)', region: 'Abuja & FCT' },
  { name: 'Port Harcourt Elec (PHED)', region: 'Port Harcourt' },
  { name: 'Kano Electricity (KEDCO)', region: 'Kano & North' }
];
