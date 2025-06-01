import axios from 'axios';
import { User } from '../types/user';
import { CakeDebt } from '../types/cakes';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const createUser = async (data: { name: string; email: string }) => {
  const response = await api.post<User>('/users', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const listUsers = async () => {
  const response = await api.get<User[]>('/users'); // Fixed type to User[]
  return response.data;
};

export const getCakes = async () => {
  const response = await api.get<CakeDebt[]>('/cakes');
  return response.data;
};

export const getCakesByUserId = async (userId: number) => {
  const response = await api.get<CakeDebt[]>(`/cakes/user/${userId}`);
  return response.data;
};

export const createCakeDebt = async (data: { userId: number; reason: string; date: string }) => {
  const response = await api.post<CakeDebt>('/cakes', data);
  return response.data;
};

export const markCakeAsPaid = async (id: number) => {
  const response = await api.put<CakeDebt>(`/cakes/${id}/pay`);
  return response.data;
};

export const getQtdCakeAsPaid = async () => {
  const response = await api.get<CakeDebt[]>(`/cakes/pay`); // Assuming it returns CakeDebt[]
  return response.data;
};

export const getUsersMaxPendingCakes = async () => {
  const response = await api.get<{ user: User | any; pendingCount: number; debts: CakeDebt[] }[]>(
    '/cakes/max-pending',
  );
  return response.data || null; // Return null if no data
};