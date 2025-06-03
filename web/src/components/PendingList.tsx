'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { getCakes, markCakeAsPaid } from '../lib/api';
import { CakeDebt } from '@/types/cakes';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

export default function PendingDebtsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Query for fetching pending debts
  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['pendingDebts'],
    queryFn: async () => {
      const data = await getCakes();
      return data.filter((debt) => debt.status === 'pending');
    },
  });

  // Mutation for marking a cake as paid
  const mutation = useMutation({
    mutationFn: markCakeAsPaid,
    onSuccess: () => {
      toast.success('Bólos quitado! Bolo entregue! 🎉');
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['cakes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => {
      toast.error('Erro ao marcar como pago 😞');
    },
  });

  const handleMarkAsPaid = (id: number) => {
    mutation.mutate(id);
  };

  // Filter debts based on search query
  const filteredDebts = debts.filter(
    (debt) =>
      debt.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debt.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">

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

        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header with system status */}
        <div
          className={`mb-8 transition-all duration-1000 opacity-100 translate-y-0
            }`}
        >
          <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="🔍 Pesquisar pagador de bólos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
              />
            </div>
            <div className="text-gray-300 font-mono text-sm">
              | BÓLOS PENDENTES
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`group relative transition-all duration-1000 delay-300 'opacity-100 translate-y-0
            }`}
        >
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
                    radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '25px 25px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text">
                  ⏳ Bólos Pendentes
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-300 font-mono">Carregando Bólos...</p>
                </div>
              ) : filteredDebts.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  {searchQuery ? (
                    <>
                      <div className="text-6xl">🤔</div>
                      <p className="text-xl text-gray-300 font-mono font-semibold">
                        Nenhum bólos encontrado para "{searchQuery}"
                      </p>
                      <p className="text-gray-400 font-mono">Tente outro termo de pesquisa.</p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl">🎉</div>
                      <p className="text-xl text-gray-300 font-mono font-semibold">
                        Parabéns! Nenhum bólos pendente!
                      </p>
                      <p className="text-gray-400 font-mono">
                        A equipe está se comportando... por enquanto! 😄
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 space-y-4 pr-2">
                  {filteredDebts.map((debt) => (
                    <div
                      key={debt.id}
                      className="bg-gray-800/50 border backdrop-blur-sm rounded-2xl p-6 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 w-full"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="space-y-6 w-full">
                          <div className='w-full flex justify-center items-center'>
                            <Image
                              src={`http://192.168.7.9:8080/${debt.user.photo}`}
                              alt={debt.user.name}
                              width={200}
                              height={200}
                              className="rounded-full flex object-cover border-4 border-gray-700/50 group-hover/debt:border-purple-400 transition-all duration-300"
                              onError={() =>
                                toast.error(`Erro ao carregar imagem de ${debt.user.name}`)
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🧑‍💻</span>
                            <p className="text-white font-bold text-lg font-mono group-hover/debt:text-purple-400 transition-colors">
                              {debt.user.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">💭</span>
                            <p className="text-gray-300 font-mono">{debt.reason}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📅</span>
                            <p className="text-gray-400 text-sm font-mono">
                              {new Date(debt.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='items-end flex justify-end mt-6'>
                        <button
                          onClick={() => handleMarkAsPaid(debt.id)}
                          disabled={mutation.isPending}
                          className="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span>{mutation.isPending ? 'Processando...' : 'Bólos pago!'}</span>
                            {!mutation.isPending && (
                              <span className="group-hover/btn:translate-x-1 transition-transform">
                                →
                              </span>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        </button>
                      </div>

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 rounded-2xl opacity-0 group-hover/debt:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Terminal-style feedback */}
          <div
            className={`mt-8 transition-all duration-1000 delay-500 opacity-100 translate-y-0
            }`}
          >
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 font-mono">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">terminal</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">admin@bolos-ti</span>
                <span className="text-gray-400">:</span>
                <span className="text-purple-400">~/pending-bolos</span>
                <span className="text-gray-400">$ </span>
                <span className="text-white">
                  echo "Acompanhe os bólos pendentes! 🎂"
                </span>
              </div>
              <div className="text-gray-300 mt-2 ml-2">
                Acompanhe os bólos pendentes! 🎂
              </div>
              <div className="flex items-center mt-4">
                <span className="text-blue-400">admin@bolos-ti</span>
                <span className="text-gray-400">:</span>
                <span className="text-purple-400">~/pending-bolos</span>
                <span className="text-gray-400">$ </span>
                <span className="animate-pulse text-white">█</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}