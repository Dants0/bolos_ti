"use client"
import ListUsers from '@/components/ListUsers';
import CreateUserForm from '@/components/CreateUserForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


export default function UsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateUserForm />
      <ListUsers />
    </QueryClientProvider>
  );
}