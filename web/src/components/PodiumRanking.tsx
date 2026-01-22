'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopPaidUsers } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface TopUser {
  userId: number;
  name: string;
  paidCount: number;
  photo: string;
}

export default function PodiumRanking() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { data: topUsers = [], isLoading } = useQuery<TopUser[]>({
    queryKey: ['topPaidUsers'],
    queryFn: getTopPaidUsers,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoadingComplete(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-16 text-center">
        <p className="text-gray-400 font-mono">Carregando ranking...</p>
      </div>
    );
  }

  if (topUsers.length === 0) {
    return null;
  }

  const positions = [
    { place: 2, user: topUsers[1], medal: '🥈', color: 'from-gray-400 to-gray-500', height: 'h-32', delay: 'delay-300' },
    { place: 1, user: topUsers[0], medal: '🥇', color: 'from-yellow-400 to-yellow-600', height: 'h-40', delay: 'delay-100' },
    { place: 3, user: topUsers[2], medal: '🥉', color: 'from-orange-600 to-orange-700', height: 'h-24', delay: 'delay-500' },
  ];

  return (
    <div className={`mb-16 transition-all duration-1000 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
          {/* Title */}
          <div className="flex items-center justify-center space-x-3 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 bg-clip-text">
              🏆 Top 3 - Quem Mais Pagou Bólos
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-8 max-w-4xl mx-auto">
            {positions.map((pos, idx) => {
              if (!pos.user) return null;
              
              return (
                <div
                  key={pos.place}
                  className={`flex flex-col items-center transition-all duration-1000 ${pos.delay} ${
                    loadingComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  {/* User Info */}
                  <div className="mb-4 text-center transform hover:scale-110 transition-transform duration-300">
                    <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '2s', animationDelay: `${idx * 100}ms` }}>
                      {pos.medal}
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 min-w-[180px]">
                      {pos.user.photo && (
                        <div className="flex justify-center mb-3">
                          <Image
                            src={`http://192.168.1.192:8080/${pos.user.photo}`}
                            alt={pos.user.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-[80px] h-[80px] border-2 border-gray-600"
                          />
                        </div>
                      )}
                      <p className="text-white font-bold text-lg mb-1">{pos.user.name}</p>
                      <p className="text-gray-400 font-mono text-sm">
                        {pos.user.paidCount} bólo{pos.user.paidCount !== 1 ? 's' : ''} pago{pos.user.paidCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Podium Base */}
                  <div className={`relative w-40 ${pos.height} rounded-t-2xl bg-gradient-to-br ${pos.color} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
                    <span className="text-white text-6xl font-black relative z-10 drop-shadow-lg">
                      {pos.place}
                    </span>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative elements */}
          
        </div>
      </div>
    </div>
  );
}
