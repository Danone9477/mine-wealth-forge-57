
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AdminAccess from '@/components/AdminAccess';
import { 
  Menu, 
  X, 
  Home, 
  Pickaxe, 
  Wallet, 
  CreditCard, 
  History, 
  Users, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handlePickaxeClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    console.log(`Clique na picareta: ${newCount}/5`);
    
    if (newCount === 5) {
      setShowAdminAccess(true);
      setClickCount(0);
    }
    
    // Reset counter after 3 seconds of inactivity
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  const mainNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/miners', icon: Pickaxe, label: 'Mineradores' },
    { to: '/deposit', icon: Wallet, label: 'Depósito' },
    { to: '/withdraw', icon: CreditCard, label: 'Saque' },
    { to: '/history', icon: History, label: 'Histórico' },
    { to: '/affiliates', icon: Users, label: 'Afiliados' },
  ];

  if (!user) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Pickaxe 
                className="h-8 w-8 text-gold-400 cursor-pointer transition-transform hover:scale-110" 
                onClick={handlePickaxeClick}
              />
              <span className="text-xl font-bold text-white">Mine Wealth</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700">
                <Link to="/register">Registrar</Link>
              </Button>
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 hover:from-gold-500 hover:to-gold-700">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Registrar</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <AdminAccess 
          isOpen={showAdminAccess} 
          onClose={() => setShowAdminAccess(false)} 
        />
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Pickaxe 
              className="h-8 w-8 text-gold-400 cursor-pointer transition-transform hover:scale-110" 
              onClick={handlePickaxeClick}
            />
            <span className="text-xl font-bold text-white">Mine Wealth</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.to}
                asChild
                variant={isActive(item.to) ? "default" : "ghost"}
                className={isActive(item.to) 
                  ? "bg-gold-600 text-gray-900 hover:bg-gold-700" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
                }
              >
                <Link to={item.to} className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Olá, {userData?.username}</span>
              <span className="text-gold-400 font-semibold">{userData?.balance?.toFixed(2)} MT</span>
            </div>
            
            {userData?.isAdmin && (
              <Button asChild variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                <Link to="/admin">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Sair</span>
            </Button>
            
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-2">
              <div className="md:hidden px-3 py-2 bg-gray-800 rounded">
                <p className="text-gray-300 text-sm">Olá, {userData?.username}</p>
                <p className="text-gold-400 font-semibold">{userData?.balance?.toFixed(2)} MT</p>
              </div>
              
              {mainNavItems.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant={isActive(item.to) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.to) 
                      ? "bg-gold-600 text-gray-900 hover:bg-gold-700" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Link to={item.to} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <AdminAccess 
        isOpen={showAdminAccess} 
        onClose={() => setShowAdminAccess(false)} 
      />
    </nav>
  );
};

export default Navigation;
