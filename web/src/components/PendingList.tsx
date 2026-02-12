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

      {/* Background Matrix-like effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>

        {/* Grid pattern */}
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

        {/* Moving particles */}
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
        {/* Main Content */}
        <div className="group relative transition-all duration-1000 delay-300 opacity-100 translate-y-0">
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
                    radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 1px, transparent 2px)
                  `,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text">
                  ⏳ Bólos Pendentes
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-300 font-mono">Carregando Bólos...</p>
                </div>
              ) : filteredDebts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl text-gray-300 font-mono">
                    Nenhum bólos pendente!
                  </p>
                  <p className="text-gray-400 mt-2 font-mono">
                    A equipe está se comportando... por enquanto! 😄
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDebts.map((debt) => {
                    const daysPending = Math.floor((new Date().getTime() - new Date(debt.date).getTime()) / (1000 * 60 * 60 * 24));
                    const isCaloteiro = daysPending > 7;

                    return (
                      <div
                        key={debt.id}
                        className={`group relative bg-gray-800/50 rounded-2xl p-6 border transition-all duration-300 
                          ${isCaloteiro ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-500' : 'border-gray-700/50 hover:border-blue-500/50'}
                        `}
                      >
                        {/* Caloteiro Badge */}
                        {isCaloteiro && (
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md rotate-3 shadow-lg z-30 uppercase animate-pulse">
                            Caloteiro(a)
                          </div>
                        )}

                        <div className="absolute top-4 right-4 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(debt)}
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="Editar bólos"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCake(debt.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Apagar bólos"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <Image
                              src={`http://192.168.1.192:8080/${debt.user.photo}`}
                              alt={debt.user.name}
                              width={150}
                              height={150}
                              className={`rounded-full object-cover border-4 transition-all duration-300 w-[150px] h-[150px]
                                ${isCaloteiro ? 'border-red-500/40 group-hover:border-red-500' : 'border-gray-700/50 group-hover:border-blue-400'}
                              `}
                              onError={() =>
                                toast.error(`Erro ao carregar imagem de ${debt.user.name}`)
                              }
                            />
                          </div>

                          <div className="space-y-2 w-full">
                            <h3 className={`text-xl font-bold font-mono transition-colors
                              ${isCaloteiro ? 'text-red-400' : 'text-white group-hover:text-blue-400'}
                            `}>
                              {debt.user.name}
                            </h3>
                            <p className="text-gray-300 font-mono text-sm">{debt.reason}</p>
                            {debt.dsReason && (
                              <p className="text-gray-400 font-mono text-xs italic opacity-70">{debt.dsReason}</p>
                            )}

                            <div className="pt-4 space-y-3 border-t border-gray-700/30 mt-4">
                              <div className="flex flex-col space-y-2">
                                <span className="text-sm text-blue-400 font-mono font-bold uppercase tracking-wider">
                                  📅 Ocorrido: {new Date(debt.dateOcorrido).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="text-sm text-purple-400 font-mono font-bold uppercase tracking-wider">
                                  🎂 Bólos: {new Date(debt.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              {daysPending > 0 && (
                                <p className={`text-base font-mono font-bold ${isCaloteiro ? 'text-red-500' : 'text-green-400'}`}>
                                  {daysPending} DIAS PENDENTES
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 mt-6">
                              <button
                                onClick={() => handleMarkAsPaid(debt.id)}
                                disabled={mutation.isPending}
                                className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50
                                  ${isCaloteiro ? 'bg-red-600/80 hover:bg-red-600 text-white' : 'bg-green-600/80 hover:bg-green-600 text-white'}
                                `}
                              >
                                {mutation.isPending ? '...' : 'MARCAR COMO PAGO'}
                              </button>
                              <button
                                onClick={() => handleDeleteCake(debt.id)}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 bg-gray-700/50 hover:bg-red-600/80 text-white rounded-xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-red-500/50"
                                title="Apagar registro"
                              >
                                {deleteMutation.isPending ? '...' : '🗑️'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10
                          ${isCaloteiro ? 'bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0' : 'bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0'}
                        `}></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
