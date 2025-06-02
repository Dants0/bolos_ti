'use client';

import { User } from '@/types/user';

interface UserSelectProps {
  userId: string;
  setUserId: (id: string) => void;
  users?: User[]; // Optional: if users are passed as a prop
}

export default function UserSelect({ userId, setUserId, users }: UserSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="userId" className="block text-lg font-mono text-gray-300">
        👤 Usuário
      </label>
      <select
        id="userId"
        value={userId}
        onChange={handleChange}
        className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
        required
        disabled={!users || users.length === 0}
      >
        <option value="" className="bg-gray-800">
          {users && users.length > 0 ? 'Selecione um usuário...' : 'Nenhum usuário disponível'}
        </option>
        {(users || []).map((user) => (
          <option key={user.id} value={user.id} className="bg-white text-black">
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}