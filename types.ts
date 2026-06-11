export interface Transaction {
  id: string;
  type: 'deposit' | 'transfer' | 'airtime' | 'data' | 'service' | 'interest' | 'commission';
  title: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
  reference: string;
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
