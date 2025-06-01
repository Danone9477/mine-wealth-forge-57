
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, User, LogOut, Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gold-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-gold p-2 rounded-lg group-hover:animate-glow">
              <Coins className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              MineWealth Forge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-gold-400 bg-gold-400/10' 
                      : 'text-gray-300 hover:text-gold-400'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/miners" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/miners') 
                      ? 'text-gold-400 bg-gold-400/10' 
                      : 'text-gray-300 hover:text-gold-400'
                  }`}
                >
                  Mineradores
                </Link>
                <Link 
                  to="/deposit" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/deposit') 
                      ? 'text-gold-400 bg-gold-400/10' 
                      : 'text-gray-300 hover:text-gold-400'
                  }`}
                >
                  Depósito
                </Link>
                <Link 
                  to="/withdraw" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/withdraw') 
                      ? 'text-gold-400 bg-gold-400/10' 
                      : 'text-gray-300 hover:text-gold-400'
                  }`}
                >
                  Levantamento
                </Link>
                
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-700">
                  <div className="text-sm">
                    <span className="text-gray-400">Saldo: </span>
                    <span className="text-gold-400 font-bold">{userData?.balance || 0} MT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{userData?.username}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-gold-400">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-gold text-gray-900 hover:bg-gold-500">
                    Registrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-gold-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {user ? (
              <div className="space-y-2">
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/miners" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mineradores
                </Link>
                <Link 
                  to="/deposit" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Depósito
                </Link>
                <Link 
                  to="/withdraw" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Levantamento
                </Link>
                <div className="px-3 py-2 border-t border-gray-700 mt-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Saldo: <span className="text-gold-400 font-bold">{userData?.balance || 0} MT</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    Usuário: <span className="text-gray-300">{userData?.username}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
