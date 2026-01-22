"use client"
import CreateCakeDebtForm from "@/components/CreateCakesDebtForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RegisterCakePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateCakeDebtForm />
    </QueryClientProvider>
  );
}
