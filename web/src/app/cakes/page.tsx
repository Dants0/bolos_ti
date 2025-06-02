"use client"
import CreateCakeDebtForm from "@/components/CreateCakesDebtForm";
import PendingDebtsList from "@/components/PendingList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

export default function CakesPage() {
  return (
      <QueryClientProvider client={queryClient}>
        <div className="">
          <CreateCakeDebtForm />
          <PendingDebtsList />
        </div>
      </QueryClientProvider>
  );
}