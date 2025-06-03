'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { listUsers } from '../lib/api';
import { User } from '../types/user';

export default function ListUsers() {
  const [users, setUsers] = useState<User[] | any>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Erro ao carregar usuários 😞');
      }
    };
    fetchUsers();

    // Loading animation
    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

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
        {/* Main Content */}
        <div
          className={`group relative transition-all duration-1000 delay-300 ${loadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
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
                  👥 Equipe
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤷‍♂️</div>
                  <p className="text-xl text-gray-300 font-mono">
                    Nenhum colaborador cadastrado ainda...
                  </p>
                  <p className="text-gray-400 mt-2 font-mono">
                    Que tal adicionar o primeiro?
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user: User) => (
                    <div
                      key={user.id}
                      className="group relative bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        {user.photo ? (
                          <div className="relative">
                            <Image
                              src={`http://192.168.7.9:8080/${user.photo}`}
                              width={100}
                              height={100}
                              alt={user.name}
                              className="rounded-full object-cover border-4 border-gray-700/50 group-hover:border-blue-400 transition-all duration-300"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-2">
                              <span className="text-white text-sm">👨‍💻</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center border-4 border-gray-700/50 group-hover:border-blue-400 transition-all duration-300">
                            <span className="text-white text-3xl font-bold font-mono">
                              {user.name[0].toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 space-y-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-mono">
                            {user.name}
                          </h3>
                          <span className='text-sm font-bold text-white group-hover:text-blue-400 transition-colors font-mono'>
                            id: {user.id}
                          </span>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/30 text-green-400 text-xs font-mono font-semibold">
                            ✅ Ativo
                          </div>
                        </div>

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}