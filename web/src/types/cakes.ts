import { User } from './user';

export interface CakeDebt {
  id: number;
  user: User;
  reason: string;
  date: string;
  status: 'pending' | 'paid';
}