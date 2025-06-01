'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCakeDebt } from '../lib/api';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const reasons = [
  '🐛 Bug em produção',
  '🔧 Gambiarra detectada',
  '💥 Quebrou o build',
  '🚨 Commit na master sem review',
  '🗑️ Código sem comentários',
  '⚡ Hardcode de valores',
  '🔑 Credenciais no código',
  '🎯 Outros motivos',
];

export default function CreateCakeDebtForm() {

  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [date, setDate] = useState('');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Loading animation effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === '🎯 Outros motivos' ? customReason : reason;

    try {
      await createCakeDebt({
        userId: Number(userId),
        reason: finalReason,
        date,
      });
      toast.success('Dívida de bolo registrada! 🎂');
      setUserId('');
      setReason('');
      setCustomReason('');
      setDate('');
      mutation.mutate({
        userId: Number(userId),
        reason: finalReason,
        date,
      });
    } catch (error) {
      toast.error('Erro ao registrar dívida 😞');
    }
  };

  // Mutation for creating a cake debt
  const mutation = useMutation({
    mutationFn: (data: { userId: number; reason: string; date: string }) =>
      createCakeDebt(data),
    onSuccess: () => {
      toast.success('Dívida de bolo registrada! 🎂');
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['cakes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      // Reset form
      setUserId('');
      setReason('');
      setCustomReason('');
      setDate('');
      router.refresh(); // Optional: Keep if server-side props need refreshing
    },
    onError: () => {
      toast.error('Erro ao registrar dívida 😞');
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
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
          className={`mb-8 transition-all duration-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <Link href="/" className="text-green-400 font-mono text-sm">VOLTAR</Link>
            </div>
            <div className="text-gray-300 font-mono text-sm">
              | REGISTRE O BÓLOS
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div
          className={`group relative transition-all duration-1000 delay-300 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                  🎂 Registrar Nova Dívida
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="userId" className="block text-lg font-mono text-gray-300">
                    👤 ID do Usuário
                  </label>
                  <input
                    id="userId"
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
                    placeholder="Digite o ID do desenvolvedor..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="block text-lg font-mono text-gray-300">
                    💭 Motivo da Dívida
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
                    required
                  >
                    <option value="" className="bg-gray-800">
                      Selecione o motivo...
                    </option>
                    {reasons.map((r) => (
                      <option key={r} value={r} className="bg-gray-800">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {reason === '🎯 Outros motivos' && (
                  <div className="space-y-2">
                    <label
                      htmlFor="customReason"
                      className="block text-lg font-mono text-gray-300"
                    >
                      ✏️ Descreva o motivo
                    </label>
                    <input
                      id="customReason"
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
                      placeholder="Descreva o que aconteceu..."
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="date" className="block text-lg font-mono text-gray-300">
                    📅 Data do Ocorrido
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>{mutation.isPending ? 'Registrando...' : '🎂 Adicionar Dívida de Bolo'}</span>
                    {!mutation.isPending && (
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Terminal-style feedback */}
        <div
          className={`mt-8 transition-all duration-1000 delay-500 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
              <span className="text-purple-400">~/create-cake-debt</span>
              <span className="text-gray-400">$ </span>
              <span className="text-white">
                echo "Registre o bolo devido, não deixe escapar! 🎂"
              </span>
            </div>
            <div className="text-gray-300 mt-2 ml-2">
              Registre o bolo devido, não deixe escapar! 🎂
            </div>
            <div className="flex items-center mt-4">
              <span className="text-blue-400">admin@bolos-ti</span>
              <span className="text-gray-400">:</span>
              <span className="text-purple-400">~/create-cake-debt</span>
              <span className="text-gray-400">$ </span>
              <span className="animate-pulse text-white">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}