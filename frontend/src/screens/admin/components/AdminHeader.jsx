import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white px-8 py-5 flex items-center justify-between shadow-lg">
      <h2 className="text-2xl font-bold tracking-tight">
        Admin Panel
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-lg font-medium">Welcome, {user?.email || 'Admin'}</span>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
          <span className="text-xl font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  );
}
