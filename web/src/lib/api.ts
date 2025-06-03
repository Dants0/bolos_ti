import axios from 'axios';
import { User } from '../types/user';
import { CakeDebt } from '../types/cakes';

const api = axios.create({
  baseURL: 'http://192.168.7.9:8080',
});

export const createUser = async (data: { name: string }) => {
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

export interface PendingCakeUser {
  userId: number;
  name: string;
  status: string;
}

export interface PaidCakeUser {
  userId: number;
  name: string;
  status: string;
}

export const getUsersMaxPendingCakes = async (): Promise<PendingCakeUser | null> => {
  const response = await api.get<{ data: PendingCakeUser[] }>('/cakes/max-pending');
  return response.data.data[0] || null;
};

export const getUsersMaxPaidCakes = async (): Promise<PaidCakeUser | null> => {
  const response = await api.get<{ data: PaidCakeUser[] }>('/cakes/max-paid');
  return response.data.data[0] || null;
};