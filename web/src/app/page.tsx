'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { listUsers, getCakes, getQtdCakeAsPaid, getUsersMaxPaidCakes, PaidCakeUser } from '@/lib/api';

export default function Home() {
  const [cakes, setCakes] = useState<any[]>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [qtdBolosPaid, setQtdBolosPaid] = useState<number>(0);
  const [qtdBolosDevidos, setQtdBolosDevidos] = useState<number>(0);
  const [qtdUsers, setQtdUsers] = useState<number>(0);
  const [userBestPaid, setUserBestPaid] = useState<PaidCakeUser | null>(null);

  useEffect(() => {
    const getAllInformations = async () => {
      try {
        const users = await listUsers();
        setQtdUsers(users.length);

        const allCakes = await getCakes();
        setCakes(allCakes);
        const pendingCakes = allCakes.filter((cake) => cake.status === 'pending');
        setQtdBolosDevidos(pendingCakes.length);

        const paidCakes = await getQtdCakeAsPaid();
        setQtdBolosPaid(paidCakes.length);
      } catch (error) {
        toast.error('Erro ao carregar estatísticas 😞');
      }
    };
    getAllInformations();

    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paid = await getUsersMaxPaidCakes();
        setUserBestPaid(paid);
      } catch (e) { }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Bólos Pagos', value: qtdBolosPaid.toString(), icon: '💲', link: "/cakes/pay" },
    { label: 'Bólos Pendentes', value: qtdBolosDevidos.toString(), icon: '🍰' },
    { label: 'Colaboradores', value: qtdUsers.toString(), icon: '👨‍💻' },
  ];

  const maxPaidsAndPending = [
    {
      label: 'Quem mais pagou bólos?',
      value: userBestPaid ? userBestPaid.name : 'Ninguém',
      icon: '🏆',
    },
  ];

  // Subtle Integrity Logic
  const pendingCakes = cakes.filter(c => c.status === 'pending');
  const oldestPending = [...pendingCakes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

  const hasCaloteiros = pendingCakes.length > 0;
  const daysWithoutCalote = 0; // Fixed logic as per instructions: if has caloteiros, it's 0.

  // Emergency Mode Logic: Debts older than 15 days
  const isEmergency = pendingCakes.some(c => {
    const days = Math.floor((new Date().getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
    return days > 15;
  });

  const terminalLogs = [
    "Todo bug em produção merece ser celebrado... com bolo! 🎉",
    ...pendingCakes.filter(c => {
      const days = Math.floor((new Date().getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
      return days > 7;
    }).map(c => `[WARNING] Caloteiro detectado: @${c.user.name} (${Math.floor((new Date().getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24))} dias)`)
  ];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-1000 bg-gray-900">
      {/* Subtle Emergency Pulse */}


      <div className="relative z-10 container mx-auto px-6 py-12">
        <div
          className={`mb-8 transition-all duration-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm uppercase tracking-tighter">System Online</span>
              <span className="text-blue-400 font-mono text-xs ml-4">
                DIAS SEM CALOTES: {hasCaloteiros ? '0' : '99'}
              </span>
            </div>
            <div className="text-gray-300 font-mono text-xs opacity-50 space-x-4 flex items-center">
              <span>SYNC_SUCCESS</span>
              <span>| BUILD v1.0.2</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 delay-300 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="relative inline-block">
            <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              BÓLOS.TI
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10"></div>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
            <span className="text-blue-300 font-mono text-sm tracking-wider">
              SISTEMA AVANÇADO DE BÓLOS
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Sistema avançado de <span className="text-blue-400 font-semibold">rastreamento de bólos</span> para o time
            de TI Labcmi. Monitore <span className="text-purple-400 font-semibold">bombas</span>,{' '}
            <span className="text-purple-400 font-semibold">gambiarras</span> e{' '}
            <span className="text-purple-400 font-semibold">bólos</span> em tempo real.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-500 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {maxPaidsAndPending.map((stat, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white mb-1 truncate">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
          {stats.map((stat, index) => (
            <Link key={index} href={stat.link || '#'} className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-12 gap-8 mb-16">
          {/* Main Actions */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/users" className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.01]">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">👨‍💻</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Usuários</h3>
                  <p className="text-blue-400 font-mono text-xs">COLABORADORES_ACTIVE: {qtdUsers}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Administração central de agentes e manipuladores de código.</p>
              <div className="inline-flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                <span>Acessar</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link href="/cakes" className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.01]">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">🎂</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Bólos Tracker</h3>
                  <p className="text-purple-400 font-mono text-xs">PENDING_QUEUE: {qtdBolosDevidos}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Monitoramento de bombas, gambiarras e débitos técnicos acumulados.</p>
              <div className="inline-flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <span>Acessar</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Terminal Feed */}
            <div className="md:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 font-mono text-xs overflow-hidden h-[200px]">
              <div className="flex items-center space-x-2 mb-4 border-b border-gray-800 pb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400/50 rounded-full"></div>
                </div>
                <span className="text-gray-600 text-[9px] uppercase tracking-widest">Live Terminal Feed</span>
              </div>
              <div className="space-y-1.5 marquee-vertical">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={log.includes('WARNING') ? 'text-red-400' : 'text-green-400/80'}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                <div className="flex items-center text-white">
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow Rank Area */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6">
              <div className="flex items-center space-x-3 mb-6 border-b border-red-500/10 pb-4">
                <span className="text-2xl">💀</span>
                <div>
                  <h3 className="text-sm font-black text-red-400 uppercase tracking-tighter">Shadow Rank</h3>
                  <p className="text-[10px] text-gray-500 font-mono">ZONA_DE_REBAIXAMENTO</p>
                </div>
              </div>

              <div className="space-y-3">
                {oldestPending.length > 0 ? oldestPending.map((cake, idx) => (
                  <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-3 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-red-950/50 flex items-center justify-center text-[10px] font-bold text-red-500">#{idx + 1}</div>
                      <div>
                        <div className="text-xs font-bold text-white">@{cake.user.name}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-tighter truncate w-32">{cake.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-red-500">{Math.floor((new Date().getTime() - new Date(cake.date).getTime()) / (1000 * 60 * 60 * 24))}d</div>
                      <div className="text-[8px] text-gray-600 font-mono">STALENESS</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-600 text-[10px] font-mono uppercase tracking-widest">Integridade Nominal</div>
                )}
              </div>
            </div>

            {/* Subtle QR Code Discreto */}
            <div className="flex justify-end pr-2 overflow-hidden">
              <div className="p-2 bg-white/5 border border-gray-700/50 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[8px] text-gray-500 font-mono absolute top-0 left-1 uppercase">HUD_RELAY</div>
                <img
                  //src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('http://localhost:3000/cakes/register')}`}
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('http://192.168.1.192:3000/cakes/register')}`}
                  alt="Register QR"
                  className="w-20 h-20 opacity-80 grayscale hover:grayscale-0 transition-all"
                />
                <div className="mt-1 h-0.5 w-full bg-blue-500/20 relative">
                  <div className="absolute inset-0 bg-blue-400 animate-scanline" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-scanline {
          width: 30%;
          animation: scanline 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
