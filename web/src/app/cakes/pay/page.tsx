"use client";

import ListPaidCakes from "@/components/ListPaidCakes";
import { CakeDebt } from "@/types/cakes";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

async function fetchPaidCakes(): Promise<CakeDebt[]> {
  const res = await fetch(`http://192.168.1.192:8080/cakes/allpay`, {
    method: 'GET',
    cache: "no-store"
  });
  // const res = await fetch("http://localhost:8080/cakes/allpay", {
  //   method: 'GET',
  //   cache: "no-store",
  // });
  if (!res.ok) {
    throw new Error("Erro ao carregar bolos pagos");
  }
  return res.json();
}

function CakesPayContent() {
  const { data, isLoading, isError } = useQuery<CakeDebt[]>({
    queryKey: ["paidCakes"],
    queryFn: fetchPaidCakes,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar bolos pagos.</p>;

  return <ListPaidCakes cakes={data || []} />;
}

export default function CakesPayPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CakesPayContent />
    </QueryClientProvider>
  );
}
