import { User } from './user';

export interface CakeDebt {
  id: number;
  user: User;
  reason: string;
  dsReason: string;
  date: string;
  dateOcorrido: string;
  status: 'pending' | 'paid';
}