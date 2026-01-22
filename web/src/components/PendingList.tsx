'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { deleteCake, getCakes, markCakeAsPaid, updateCake } from '../lib/api';
import { CakeDebt } from '@/types/cakes';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

export default function PendingDebtsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCake, setEditingCake] = useState<CakeDebt | null>(null);
  const [editForm, setEditForm] = useState({ reason: '', dsReason: '', date: '', dateOcorrido: '' });
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);
  const queryClient = useQueryClient();

  // Query for fetching pending debts
  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['pendingDebts'],
    queryFn: async () => {
      const data = await getCakes();
      return data.filter((debt) => debt.status === 'pending');
    },
  });

  useEffect(() => {
    // Generate particles on client side only
    setParticles(
      [...Array(10)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`,
      }))
    );
  }, []);

  // Mutation for marking a cake as paid
  const mutation = useMutation({
    mutationFn: markCakeAsPaid,
    onSuccess: () => {
      toast.success('Bólos quitado! Bolo entregue! 🎉');
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['cakes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['topPaidUsers'] });
    },
    onError: () => {
      toast.error('Erro ao marcar como pago 😞');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCake,
    onSuccess: () => {
      toast.success('Bólos apagado com sucesso 🗑️');
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['cakes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => {
      toast.error('Erro ao apagar o bólos 😞');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCake(id, data),
    onSuccess: () => {
      toast.success('Bólos atualizado com sucesso! ✏️');
      setEditingCake(null);
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['cakes'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 401 || error.response?.data?.code === 400) {
        toast.error('Senha incorreta 🔒');
      } else {
        toast.error('Erro ao atualizar bólos 😞');
      }
    },
  });

  const handleMarkAsPaid = (id: number) => {
    const passKey = window.prompt('Digite a palavra-passe para confirmar o bolos:');

    if (!passKey) {
      return; // usuário cancelou
    }

    if (passKey != "5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220") {
      toast.error("Senha incorreta")
      return;
    }

    mutation.mutate(id);
  };

  const handleDeleteCake = (id: number) => {
    const passKey = window.prompt('Digite a palavra-passe para apagar:');

    if (!passKey) return;
    if (passKey !== "5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220") {
      toast.error("Senha incorreta");
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleEditClick = (cake: CakeDebt) => {
    setEditingCake(cake);
    setEditForm({
      reason: cake.reason,
      dsReason: cake.dsReason || '',
      date: new Date(cake.date).toISOString().split('T')[0],
      dateOcorrido: new Date(cake.dateOcorrido).toISOString().split('T')[0],
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCake) return;

    const passKey = window.prompt('Digite a palavra-passe para atualizar:');
    if (!passKey) return;

    updateMutation.mutate({
      id: editingCake.id,
      data: {
        ...editForm,
        passKey
      }
    });
  };

  // Filter debts based on search query
  const filteredDebts = debts.filter(
    (debt) =>
      debt.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (debt.dsReason || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Edit Modal */}
      {editingCake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">✏️ Editar Bólos</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Motivo</label>
                <input
                  type="text"
                  value={editForm.reason}
                  onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Descrição do Motivo</label>
                <input
                  type="text"
                  value={editForm.dsReason}
                  onChange={(e) => setEditForm({ ...editForm, dsReason: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">📅 Data do Ocorrido: </label>
                <input
                  type="date"
                  value={editForm.dateOcorrido}
                  onChange={(e) => setEditForm({ ...editForm, dateOcorrido: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">📅 Data do Bólos: </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCake(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
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
                      className="bg-gray-800/50 border backdrop-blur-sm rounded-2xl p-6 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 w-full relative group/card"
                    >
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(debt)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-400 transition-colors z-20 opacity-0 group-hover/card:opacity-100"
                        title="Editar bólos"
                      >
                        ✏️
                      </button>

                      <div className="flex items-center justify-between w-full">

                        <div className="space-y-6 w-full">
                          <div className='w-full flex justify-center items-center'>
                            <Image
                              src={`http://192.168.1.192:8080/${debt.user.photo}`}
                              // src={`http://localhost:8080/${debt.user.photo}`}
                              alt={debt.user.name}
                              width={200}
                              height={200}
                              className="rounded-full object-cover border-4 border-gray-700/50 group-hover/card:border-purple-400 transition-all duration-300 w-[150px] h-[150px]"
                              onError={() =>
                                toast.error(`Erro ao carregar imagem de ${debt.user.name}`)
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-300 font-mono">{debt.reason}</p>
                          </div>
                          {debt.dsReason && (
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-300 font-mono">{debt.dsReason}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-lg text-gray-400 ">📅 Data do Ocorrido: </span>
                            <p className="text-gray-400 text-md font-mono">
                              {new Date(debt.dateOcorrido).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg text-gray-400 ">📅 Data do Bólos: </span>
                            <p className="text-gray-400 text-md font-mono">
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
                        <button
                          onClick={() => handleDeleteCake(debt.id)}
                          disabled={deleteMutation.isPending}
                          className="ml-4 group/btn relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span>{deleteMutation.isPending ? 'Apagando...' : 'Apagar bólos'}</span>
                            {!deleteMutation.isPending && (
                              <span className="group-hover/btn:translate-x-1 transition-transform">
                                🗑️
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