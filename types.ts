export interface Transaction {
  id: string;

  type:
    | 'deposit'
    | 'transfer'
    | 'airtime'
    | 'data'
    | 'service'
    | 'interest'
    | 'commission';

  title: string;

  amount: number;
  fee?: number;

  date: string;

  status:
    | 'Successful'
    | 'Pending'
    | 'Failed';

  reference: string;

  // Transfer-specific details
  recipientName?: string;
  recipientBank?: string;
  recipientAccount?: string;
  bankLogo?: string;

  transactionId?: string;
  sessionId?: string;

  // Optional PalmPay-like fields
  paymentType?: string;
  paymentMethod?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Bank {
  name: string;
  code: string;
}


// Add this to your existing types.ts

export interface ReceiptData {
  amount: number;
  recipientName: string;
  recipientBank: string;         // e.g. "Access Bank" or "PalmPay"
  recipientAccount: string;      // account number or masked phone
  recipientBankLogo?: string;
  senderName: string;            // e.g. "RANDAL WILSON"
  senderBank: string;            // e.g. "NairaPay"
  senderAccount: string;         // masked sender account
  transactionType: string;       // e.g. "Money Transfer - MMO"
  transactionId: string;
  sessionId: string;
  remark: string;
  timestamp: string;             // ISO string — formatted on render
}