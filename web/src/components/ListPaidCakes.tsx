'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CakeDebt } from "@/types/cakes";

interface Props {
  cakes: CakeDebt[];
}

export default function ListPaidCakes({ cakes }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'dateOcorrido'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter cakes based on search query
  const filteredCakes = cakes.filter(
    (cake) =>
      cake.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cake.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort cakes based on selected criteria
  const sortedCakes = [...filteredCakes].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortBy) {
      case 'name':
        aValue = a.user.name.toLowerCase();
        bValue = b.user.name.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'dateOcorrido':
        aValue = new Date(a.dateOcorrido);
        bValue = new Date(b.dateOcorrido);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: 'name' | 'date' | 'dateOcorrido') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: 'name' | 'date' | 'dateOcorrido') => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↗️' : '↘️';
  };

  if (!cakes || cakes.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-900">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900"></div>
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            ></div>
          </div>
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
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
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🍰</div>
            <p className="text-xl text-gray-300 font-mono font-semibold">
              Nenhum bólos pago encontrado
            </p>
            <p className="text-gray-400 font-mono">
              Quando alguém pagar um bólos, aparecerá aqui! 😊
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
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
        {/* Header with search and filters */}
        <div className="mb-8 transition-all duration-1000 opacity-100 translate-y-0">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Pesquisar bólos pagos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 hover:border-green-500/50"
              />
            </div>

            {/* Sort controls */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleSort('name')}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${sortBy === 'name'
                      ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:border-green-500/30'
                    }`}
                >
                  Nome {getSortIcon('name')}
                </button>
                <button
                  onClick={() => toggleSort('date')}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${sortBy === 'date'
                      ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:border-green-500/30'
                    }`}
                >
                  Data do Bólos {getSortIcon('date')}
                </button>
                <button
                  onClick={() => toggleSort('dateOcorrido')}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${sortBy === 'dateOcorrido'
                      ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:border-green-500/30'
                    }`}
                >
                  Data do Ocorrido {getSortIcon('dateOcorrido')}
                </button>
              </div>
              <div className="text-gray-300 font-mono text-sm">
                {sortedCakes.length} bólos pagos | {cakes.length} total
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="group relative transition-all duration-1000 delay-300 opacity-100 translate-y-0">
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
                    radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '25px 25px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text">
                  ✅ Bólos Pagos
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
              </div>

              {sortedCakes.length === 0 && searchQuery ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">🤔</div>
                  <p className="text-xl text-gray-300 font-mono font-semibold">
                    Nenhum bólos pago encontrado para "{searchQuery}"
                  </p>
                  <p className="text-gray-400 font-mono">Tente outro termo de pesquisa.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCakes.map((cake, index) => (
                    <div
                      key={cake.id}
                      className="group/cake bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div className="space-y-6">
                        {/* User photo */}
                        <div className="w-full flex justify-center items-center">
                          <div className="relative">
                            <Image
                              src={`http://192.168.1.192:8080/${cake.user.photo}`}
                              alt={cake.user.name}
                              width={120}
                              height={120}
                              className="rounded-full object-cover border-4 border-green-500/30 group-hover/cake:border-green-400 transition-all duration-300 shadow-lg"
                              onError={() => console.error(`Erro ao carregar imagem de ${cake.user.name}`)}
                            />
                            {/* Success indicator */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              ✓
                            </div>
                          </div>
                        </div>

                        {/* User name */}
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white group-hover/cake:text-green-300 transition-colors duration-300">
                            {cake.user.name}
                          </h3>
                        </div>

                        {/* Reason */}
                        <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">📝</span>
                            <span className="text-sm text-gray-400 font-mono">Motivo</span>
                          </div>
                          <p className="text-gray-300 font-mono text-sm leading-relaxed">
                            {cake.reason}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gray-700/20 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">⚠️</span>
                              <span className="text-xs text-gray-400 font-mono">Ocorrido em</span>
                            </div>
                            <p className="text-gray-300 text-sm font-mono">
                              {new Date(cake.dateOcorrido).toLocaleDateString('pt-BR')}
                            </p>
                          </div>

                          <div className="flex items-center justify-between bg-green-900/20 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">🎂</span>
                              <span className="text-xs text-green-400 font-mono">Pago em</span>
                            </div>
                            <p className="text-green-300 text-sm font-mono font-semibold">
                              {new Date(cake.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/5 to-emerald-600/0 rounded-2xl opacity-0 group-hover/cake:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terminal-style status */}
          <div className="mt-8 transition-all duration-1000 delay-500 opacity-100 translate-y-0">
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
                <span className="text-purple-400">~/paid-bolos</span>
                <span className="text-gray-400">$ </span>
                <span className="text-white">
                  echo "Histórico de bólos quitados! ✅"
                </span>
              </div>
              <div className="text-gray-300 mt-2 ml-2">
                Histórico de bólos quitados! ✅
              </div>
              <div className="text-green-400 mt-2 ml-2">
                📊 Status: {sortedCakes.length} bólos exibidos de {cakes.length} total
              </div>
              <div className="flex items-center mt-4">
                <span className="text-blue-400">admin@bolos-ti</span>
                <span className="text-gray-400">:</span>
                <span className="text-purple-400">~/paid-bolos</span>
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