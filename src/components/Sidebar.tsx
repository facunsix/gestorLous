import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Plus, 
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface SidebarProps {
  user: any;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ user, activeView, onViewChange, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      available: true
    },
    {
      id: 'tasks',
      label: isAdmin ? 'Gestionar Tareas' : 'Mis Tareas',
      icon: CheckSquare,
      available: true
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      available: isAdmin
    },
    {
      id: 'create-task',
      label: 'Nueva Tarea',
      icon: Plus,
      available: isAdmin
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600">
            <AvatarFallback className="text-white font-medium">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                isAdmin 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isAdmin ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems
          .filter(item => item.available)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 h-11 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          onClick={() => onViewChange('profile')}
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}