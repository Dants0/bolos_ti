import axios from 'axios';
import { User } from '../types/user';
import { CakeDebt } from '../types/cakes';

const api = axios.create({
  baseURL: 'http://192.168.1.192:8080',
  //baseURL: 'http://localhost:8080',
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

export const createCakeDebt = async (data: { userId: number; reason: string; date: string, passKey: string, dateOcorrido: string, dsReason?: string }) => {
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

export async function deleteCake(id: number): Promise<void> {
  //localhost
  const res = await fetch(`http://192.168.1.192:8080/cakes/${id}/cake`, {
    method: 'DELETE',
  });
  // const res = await fetch(`http://localhost:8080/cakes/${id}/cake`, {
  //   method: 'DELETE',
  // });

  if (!res.ok) {
    throw new Error('Erro ao apagar o bólos');
  }
}

export const updateCake = async (id: number, data: { userId?: number; reason?: string; date?: string; dateOcorrido?: string; passKey: string; dsReason?: string }) => {
  const response = await api.put<CakeDebt>(`/cakes/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number, passKey: string): Promise<void> => {
  const response = await api.delete(`/users/${id}`, {
    data: { passKey }
  });
  return response.data;
};

export interface TopUser {
  userId: number;
  name: string;
  count: number;
  photo: string;
  type: 'current' | 'historical';
}

export const getTopPaidUsers = async (): Promise<TopUser[]> => {
  const response = await api.get<TopUser[]>('/cakes/top-paid');
  return response.data;
};

export const getTopDebtors = async (): Promise<TopUser[]> => {
  const response = await api.get<TopUser[]>('/cakes/top-debtors');
  return response.data;
};

export const updateUser = async (id: number, data: { name?: string; photo?: File; passKey: string }) => {
  console.log('API: updateUser called', { id, name: data.name, hasPhoto: !!data.photo });
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.photo) formData.append('photo', data.photo);
  formData.append('passKey', data.passKey);

  console.log('API: Sending PUT request to', `/users/${id}`);
  const response = await api.put(`/users/${id}`, formData);
  return response.data;
};

