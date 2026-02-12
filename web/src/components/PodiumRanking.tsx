'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopPaidUsers, getTopDebtors, TopUser } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type ViewMode = 'PAID' | 'DEBTS';

export default function PodiumRanking() {
  const [viewMode, setViewMode] = useState<ViewMode>('PAID');
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { data: topUsers = [], isLoading, refetch } = useQuery<TopUser[]>({
    queryKey: ['topUsers', viewMode],
    queryFn: viewMode === 'PAID' ? getTopPaidUsers : getTopDebtors,
  });

  useEffect(() => {
    console.log(`DEBUG: PodiumRanking [${viewMode}] topUsers:`, topUsers);
  }, [topUsers, viewMode]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingComplete(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-16 flex flex-col items-center justify-center py-20 bg-gray-800/20 rounded-3xl border border-gray-700/30 animate-pulse">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Sincronizando Ranking...</p>
      </div>
    );
  }

  const podiumUsers = topUsers.slice(0, 3);
  const tableUsers = topUsers.slice(3, 6);

  // Reorder for podium display: [2nd, 1st, 3rd]
  const displayPodium = [
    { pos: 1, user: podiumUsers[1], medal: '🥈', color: 'from-gray-400/20 to-gray-500/40', borderColor: 'border-gray-400/50', height: 'h-32', delay: 'delay-300' },
    { pos: 0, user: podiumUsers[0], medal: '🥇', color: 'from-yellow-400/20 to-yellow-600/40', borderColor: 'border-yellow-400/50', height: 'h-44', delay: 'delay-100' },
    { pos: 2, user: podiumUsers[2], medal: '🥉', color: 'from-orange-600/20 to-orange-700/40', borderColor: 'border-orange-600/50', height: 'h-24', delay: 'delay-500' },
  ];

  const config = {
    PAID: {
      title: 'QUEM MAIS PAGOU',
      subtitle: 'HONORÁVEIS PAGADORES',
      accent: 'purple',
      label: 'Bólos Pagos',
      gradient: 'from-green-400 via-blue-400 to-purple-400'
    },
    DEBTS: {
      title: 'MAIORES CALOTEIROS',
      subtitle: 'EMERGÊNCIA FINANCEIRA',
      accent: 'red',
      label: 'Dias de Atraso',
      gradient: 'from-red-400 via-orange-400 to-red-600'
    }
  }[viewMode];

  return (
    <div className={`mb-16 transition-all duration-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="bg-gray-800/40 backdrop-blur-2xl border border-gray-700/40 rounded-[2.5rem] p-10 hover:border-purple-500/30 transition-all duration-700 shadow-2xl relative group">

        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/60 p-1.5 rounded-2xl border border-gray-700/50 flex items-center shadow-inner">
            <button
              onClick={() => setViewMode('PAID')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-[0.2em] transition-all duration-500 uppercase ${viewMode === 'PAID'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              Honra (Pagos)
            </button>
            <button
              onClick={() => setViewMode('DEBTS')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-[0.2em] transition-all duration-500 uppercase ${viewMode === 'DEBTS'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              Dívida (Pendentes)
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-16 space-y-2">
          <p className={`text-[10px] font-black tracking-[0.5em] uppercase ${viewMode === 'PAID' ? 'text-purple-400' : 'text-red-400'} opacity-80 mb-2`}>
            {config.subtitle}
          </p>
          <h2 className={`text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r ${config.gradient} bg-clip-text inline-block filter drop-shadow-sm`}>
            {config.title}
          </h2>
        </div>

        {/* Podium Display */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-12 mb-16 min-h-[400px]">
          {topUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-60">
              <span className="text-6xl mb-6 grayscale text-gray-400">⚖️</span>
              <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">O equilíbro foi restaurado.</p>
            </div>
          ) : (
            displayPodium.map((pos) => {
              const user = pos.user;
              if (!user) return <div key={`podium-placeholder-${pos.pos}`} className="hidden md:block w-40"></div>;

              return (
                <div
                  key={`podium-user-${user.userId}`}
                  className={`flex flex-col items-center w-full md:w-48 group-podium transition-all duration-1000 ${pos.delay}`}
                >
                  {/* Avatar & Medal */}
                  <div className="relative mb-6 transform group-podium-hover:-translate-y-4 transition-transform duration-500 cursor-pointer">
                    <div className="absolute -top-4 w-full flex justify-center text-5xl z-20 drop-shadow-xl animate-bounce-slow">
                      {pos.medal}
                    </div>
                    <div className={`relative p-1 rounded-full bg-gradient-to-br ${pos.color} shadow-2xl`}>
                      <div className="bg-gray-900 rounded-full p-1 overflow-hidden relative">
                        {user.photo ? (
                          <Image
                            src={`http://192.168.1.192:8080/${user.photo}`}
                            alt={user.name}
                            width={120}
                            height={120}
                            className="rounded-full object-cover w-24 h-24 md:w-32 md:h-32 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-gray-800 text-4xl font-black text-white uppercase font-mono">
                            {user.name[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="w-full relative">
                    <div className={`w-full ${pos.height} rounded-2xl bg-gradient-to-b ${pos.color} border-t-2 ${pos.borderColor} flex flex-col items-center justify-center relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group/base`}>
                      <div className="absolute inset-0 bg-white/5 opacity-0 group/base-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="text-white/40 text-8xl font-black absolute -bottom-2 -right-2 italic select-none pointer-events-none">{pos.pos + 1}</span>

                      <div className="text-center px-4 z-10">
                        <h3 className="text-white font-black text-lg md:text-xl truncate w-full mb-1 tracking-tight">
                          {user.name.split(' ')[0]}
                        </h3>
                        <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-black tracking-widest uppercase opacity-60 mb-1 ${viewMode === 'PAID' ? 'text-green-300' : 'text-red-300'}`}>
                            {config.label}
                          </span>
                          <span className="text-2xl font-black text-white tabular-nums drop-shadow-md">
                            {user.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lower Table Ranking */}
        {tableUsers.length > 0 && (
          <div className="mt-8 border-t border-gray-700/30 pt-10">
            <div className="flex items-center justify-between mb-6 px-4">
              <h4 className="text-gray-400 font-black text-xs tracking-widest uppercase">Próximos na Fila</h4>
              <div className="h-px bg-gray-700/30 flex-1 mx-6"></div>
            </div>

            <div className="space-y-3">
              {tableUsers.map((user, idx) => (
                <div
                  key={`table-user-${user.userId}`}
                  className="flex items-center justify-between p-4 bg-gray-900/30 rounded-2xl border border-gray-700/20 hover:border-purple-500/20 hover:bg-gray-800/40 transition-all duration-300 group/row"
                >
                  <div className="flex items-center space-x-5">
                    <span className="font-mono text-gray-500 font-bold group/row-hover:text-purple-400 transition-colors">#{idx + 4}</span>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0">
                      {user.photo ? (
                        <Image src={`http://192.168.1.192:8080/${user.photo}`} alt={user.name} width={40} height={40} className="w-full h-full object-cover grayscale-[0.5] group/row-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-500">{user.name[0]}</div>
                      )}
                    </div>
                    <span className="text-gray-300 font-bold tracking-tight">{user.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black tabular-nums transition-colors ${viewMode === 'PAID' ? 'text-green-400' : 'text-red-400'}`}>
                      {user.count}
                    </span>
                    <span className="text-[9px] text-gray-500 font-black block uppercase tracking-tighter opacity-70">
                      {config.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
