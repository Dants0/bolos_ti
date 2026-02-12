'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { listUsers, deleteUser, updateUser } from '../lib/api';
import { User } from '../types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ListUsers() {
  const [users, setUsers] = useState<User[] | any>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', passKey: '', photo: null as File | null });
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários 😞');
    }
  };

  useEffect(() => {
    fetchUsers();

    // Loading animation
    const loadingTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 500);

    // Generate particles on client side only
    setParticles(
      [...Array(10)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`,
      }))
    );

    return () => clearTimeout(loadingTimer);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: ({ id, passKey }: { id: number; passKey: string }) => deleteUser(id, passKey),
    onSuccess: () => {
      toast.success('Usuário removido com sucesso! 🗑️');
      fetchUsers(); // Refresh list
    },
    onError: (error: any) => {
      if (error.response?.status === 401 || error.response?.data?.code === 400) {
        toast.error('Senha incorreta 🔒');
      } else {
        toast.error('Erro ao remover usuário 😞');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, photo, passKey }: { id: number; name?: string; photo?: File; passKey: string }) =>
      updateUser(id, { name, photo, passKey }),
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso! ✨');
      setEditingUser(null);
      fetchUsers();
    },
    onError: (error: any) => {
      console.error('Update Error:', error);
      if (error.response?.status === 401 || error.response?.data?.code === 400) {
        toast.error('Senha incorreta 🔒');
      } else {
        toast.error(`Erro ao atualizar usuário: ${error.message || 'Erro desconhecido'}`);
      }
    },
  });

  const handleDeleteUser = async (id: number, name: string) => {
    const passKey = window.prompt(`Digite a senha para remover ${name}:`);
    if (!passKey) return;

    deleteMutation.mutate({ id, passKey });
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, passKey: '', photo: null });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    console.log('ListUsers: Submitting update for', editingUser.id, { name: editForm.name });
    updateMutation.mutate({
      id: editingUser.id,
      name: editForm.name,
      photo: editForm.photo || undefined,
      passKey: editForm.passKey,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">✏️ Editar Usuário</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nova Foto (opcional)</label>
                <input
                  type="file"
                  onChange={(e) => setEditForm({ ...editForm, photo: e.target.files?.[0] || null })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">PassKey de Segurança</label>
                <input
                  type="password"
                  value={editForm.passKey}
                  onChange={(e) => setEditForm({ ...editForm, passKey: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  placeholder="Digite a senha mestra"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-50 font-bold"
                >
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
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
                      <div className="absolute top-4 right-4 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Editar usuário"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Remover usuário"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        {user.photo ? (
                          <div className="relative">
                            <Image
                              src={`http://192.168.1.192:8080/${user.photo}`}
                              // src={`http://localhost:8080/${user.photo}`}
                              width={100}
                              height={100}
                              alt={user.name}
                              className="rounded-full object-cover border-4 border-gray-700/50 group-hover:border-blue-400 transition-all duration-300 w-[150px] h-[150px]"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-2">
                              <span className="text-white text-sm">👨‍💻</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center border-4 border-gray-700/50 group-hover:border-blue-400 transition-all duration-300">
                            <span className="text-white text-5xl font-bold font-mono">
                              {user.name[0].toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 space-y-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-mono">
                            {user.name}
                          </h3>
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
