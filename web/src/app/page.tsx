'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { listUsers, getCakes, getQtdCakeAsPaid, getUsersMaxPendingCakes } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [qtdBolosPaid, setQtdBolosPaid] = useState<number>(0);
  const [qtdBolosDevidos, setQtdBolosDevidos] = useState<number>(0);
  const [qtdUsers, setQtdUsers] = useState<number>(0);
  const [userBest, setUserBest] = useState<User | any>();


  useEffect(() => {
    // Fetch all data
    const getAllInformations = async () => {
      try {
        // Fetch users
        const users = await listUsers();
        setQtdUsers(users.length);

        // Fetch pending cakes
        const cakes = await getCakes();
        const pendingCakes = cakes.filter((cake) => cake.status === 'pending');
        setQtdBolosDevidos(pendingCakes.length);

        // Fetch paid cakes
        const paidCakes = await getQtdCakeAsPaid();
        setQtdBolosPaid(paidCakes.length);

        const userB = await getUsersMaxPendingCakes();
        console.log(userB)
        setUserBest(userB)

      } catch (error) {
        toast.error('Erro ao carregar estatísticas 😞');
      }
    };
    getAllInformations();

    // Update mouse position for interactive effects
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Loading animation
    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(loadingTimer);
    };
  }, []);

  // Example stats array, updated to use the new structure

  // console.log(userBest)
  const stats = [
    { label: 'Bolos Pagos', value: qtdBolosPaid.toString(), icon: '🐛' },
    { label: 'Bolos Devidos', value: qtdBolosDevidos.toString(), icon: '🍰' },
    { label: 'Colaboradores', value: qtdUsers.toString(), icon: '👨‍💻' },
    {
      label: 'Maior Devedor',
      value: userBest ? userBest[0].name : 'Nenhum',
      icon: '🏆',
    },
  ];


  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">


      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header with system status */}
        <div
          className={`mb-8 transition-all duration-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">SYSTEM ONLINE</span>
            </div>
            <div className="text-gray-300 font-mono text-sm">
              | BUILD v0.0.1
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 delay-300 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="relative">
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
            de TI Labcmi. Monitore <span className='underline'>bombas</span>, <span className='underline'>gambiarras</span> e{' '}
            <span className="text-purple-400 font-semibold">bólos</span> em tempo real.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-500 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="group relative">
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 font-mono">{stat.label}</div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Action Cards */}
        <div
          className={`grid md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-700 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="group relative">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
                      radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                  }}
                ></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-5xl">👨‍💻</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Gerenciador de Usuário</h3>
                    <p className="text-blue-400 font-mono text-sm">./users</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">Administre os colaboradores.</p>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{qtdUsers} colaboradores ativos</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>0 revisões pendentes</span>
                  </div>
                </div>

                <Link href="/users">
                  <div className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer">
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>ACESSAR</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
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
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-5xl">🎂</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Bólos Tracker</h3>
                    <p className="text-purple-400 font-mono text-sm">./cakes</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Sistema de rastreamento de bólos em tempo real, TODA GAMBIARRA SERÁ REGISTRADA!
                </p>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{qtdBolosDevidos} bolos pendentes</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>{qtdBolosPaid} bolos pagos</span>
                  </div>
                </div>

                <Link href="/cakes">
                  <div className="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer">
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>ACESSAR</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal-style quote */}
        <div
          className={`transition-all duration-1000 delay-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
              <span className="text-purple-400">~</span>
              <span className="text-gray-400">$ </span>
              <span className="text-white">
                echo "Todo bug em produção merece ser celebrado... com bolo! 🎉"
              </span>
            </div>
            <div className="text-gray-300 mt-2 ml-2">
              Todo bug em produção merece ser celebrado... com bolo! 🎉
            </div>
            <div className="flex items-center mt-4">
              <span className="text-blue-400">admin@bolos-ti</span>
              <span className="text-gray-400">:</span>
              <span className="text-purple-400">~</span>
              <span className="text-gray-400">$ </span>
              <span className="animate-pulse text-white">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}