import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true },
    { name: 'Products', path: '/admin/products' },      
    { name: 'Orders', path: '/admin/orders' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-indigo-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Calvio Mart
        </h1>
        <p className="text-sm text-gray-300 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 px-6 py-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={!!item.end}
            className={({ isActive }) =>
              `block px-5 py-3 rounded-xl mb-2 text-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <Home size={20} />
          Back to Store
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 text-white/80 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/10"
        >
          <Home size={20} />
          <span className="font-medium">Back to Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-white/80 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}