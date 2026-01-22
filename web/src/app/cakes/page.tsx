"use client"
import PendingDebtsList from "@/components/PendingList";
import PodiumRanking from "../../components/PodiumRanking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";


const queryClient = new QueryClient();

export default function CakesPage() {
  return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen relative overflow-hidden bg-gray-900">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              ></div>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-12">
            {/* Header with Register Button */}
            <div className="mb-8">
              <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <Link href="/" className="text-green-400 font-mono text-sm hover:text-green-300 transition-colors">
                  ← VOLTAR
                </Link>
                <div className="text-gray-300 font-mono text-sm">| BÓLOS TRACKER</div>
                <Link href="/cakes/register">
                  <button className="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer">
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>🎂 Registrar Novo Bólo</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Podium Ranking */}
            <PodiumRanking />

            {/* Pending Debts List */}
            <PendingDebtsList />
          </div>
        </div>
      </QueryClientProvider>
  );
}