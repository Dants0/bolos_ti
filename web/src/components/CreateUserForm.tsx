'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createUser } from '../lib/api';
import Link from 'next/link';

export default function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const router = useRouter();

  // Loading animation effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photo && photo.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB 😞');
      return;
    }
    try {
      const formData: any = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (photo) {
        formData.append('photo', photo);
      }
      const response = await createUser(formData);
      if (response.id != null) {
        toast.success('Usuário criado com sucesso! 🎉');
      }
      setName('');
      setEmail('');
      setPhoto(null);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao criar usuário 😞');
    }
  };

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
              | CRIAR COLABORADOR
            </div>
          </div>
        </div>

        {/* Form Section */}
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
                    radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text">
                  ➕ Adicionar Novo Colaborador
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-lg font-mono text-gray-300"
                  >
                    👤 Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-500/50"
                    placeholder="Digite o nome do colaborador..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-lg font-mono text-gray-300"
                  >
                    📧 Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-500/50"
                    placeholder="colaborador@labcmi.org.br"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="photo"
                    className="block text-lg font-mono text-gray-300"
                  >
                    📸 Foto do Perfil (JPG/PNG)
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:border-blue-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>🚀 Criar Usuário</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
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
              <span className="text-purple-400">~/create-user</span>
              <span className="text-gray-400">$ </span>
              <span className="text-white">
                echo "Adicione um novo colaborador ao time! 🚀"
              </span>
            </div>
            <div className="text-gray-300 mt-2 ml-2">
              Adicione um novo colaborador ao time! 🚀
            </div>
            <div className="flex items-center mt-4">
              <span className="text-blue-400">admin@bolos-ti</span>
              <span className="text-gray-400">:</span>
              <span className="text-purple-400">~/create-user</span>
              <span className="text-gray-400">$ </span>
              <span className="animate-pulse text-white">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}