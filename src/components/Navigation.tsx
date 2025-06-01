import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  Pickaxe, 
  CreditCard, 
  Banknote, 
  Users, 
  History,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';

const Navigation = () => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [pickaxeClickCount, setPickaxeClickCount] = useState(0);
  const [showPickaxePrompt, setShowPickaxePrompt] = useState(false);
  const [pickaxeKey, setPickaxeKey] = useState('');

  // Reset admin click count after 5 seconds of inactivity
  useEffect(() => {
    if (adminClickCount > 0) {
      const timer = setTimeout(() => {
        setAdminClickCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [adminClickCount]);

  // Reset pickaxe click count after 3 seconds of inactivity
  useEffect(() => {
    if (pickaxeClickCount > 0) {
      const timer = setTimeout(() => {
        setPickaxeClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pickaxeClickCount]);

  const handleAffiliatesClick = () => {
    setAdminClickCount(prev => prev + 1);
    
    // If clicked rapidly for 20+ times (approximating 20 seconds of rapid clicking)
    if (adminClickCount >= 20) {
      setShowAdminPrompt(true);
      setAdminClickCount(0);
    } else {
      navigate('/affiliates');
    }
  };

  const handlePickaxeClick = () => {
    setPickaxeClickCount(prev => prev + 1);
    
    // If clicked 5 times
    if (pickaxeClickCount >= 4) { // 4 because we're incrementing after the check
      setShowPickaxePrompt(true);
      setPickaxeClickCount(0);
    }
  };

  const handleAdminAccess = () => {
    if (adminKey === 'ADMINAPPKEY') {
      setShowAdminPrompt(false);
      setAdminKey('');
      navigate('/admin');
    } else {
      alert('Chave incorreta!');
      setAdminKey('');
    }
  };

  const handlePickaxeAdminAccess = () => {
    if (pickaxeKey === 'HAPPYMINE') {
      setShowPickaxePrompt(false);
      setPickaxeKey('');
      navigate('/admin');
    } else {
      alert('Chave incorreta!');
      setPickaxeKey('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { to: '/', icon: Home, label: 'Início' },
  ];

  const authLinks = [
    { to: '/login', icon: LogIn, label: 'Login' },
    { to: '/register', icon: UserPlus, label: 'Registrar' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/miners', icon: Pickaxe, label: 'Mineradores', onClick: handlePickaxeClick },
    { to: '/deposit', icon: CreditCard, label: 'Depósito' },
    { to: '/withdraw', icon: Banknote, label: 'Saque' },
    { to: '/affiliates', icon: Users, label: 'Afiliados', onClick: handleAffiliatesClick },
    { to: '/history', icon: History, label: 'Histórico' },
  ];

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Pickaxe 
                  className="h-8 w-8 text-gold-400 cursor-pointer hover:text-gold-500 transition-colors" 
                  onClick={handlePickaxeClick}
                />
                <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  MineWealth Forge
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-gold-400 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  {userLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={link.onClick}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-gold-400 text-gray-900'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  {userData && (
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-md">
                      <span className="text-green-400 text-sm font-medium">
                        {userData.balance} MT
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </Button>
                </>
              ) : (
                authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-gold-400 text-gray-900'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                ))
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="sm"
                className="text-gray-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.to)
                      ? 'bg-gold-400 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  {userLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(link.to)
                          ? 'bg-gold-400 text-gray-900'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  {userData && (
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-md mx-3">
                      <span className="text-green-400 text-sm font-medium">
                        Saldo: {userData.balance} MT
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.to)
                        ? 'bg-gold-400 text-gray-900'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Admin Key Prompt Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Acesso Administrativo</h3>
            <p className="text-gray-300 mb-4">Digite a chave de administrador:</p>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-4"
              placeholder="Digite a chave..."
              onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdminAccess} className="bg-gold-400 text-gray-900 hover:bg-gold-500">
                Acessar
              </Button>
              <Button onClick={() => setShowAdminPrompt(false)} variant="outline" className="border-gray-600 text-gray-300">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pickaxe Admin Prompt Modal */}
      {showPickaxePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Acesso de Administrador</h3>
            <p className="text-gray-300 mb-4">Digite a chave de acesso:</p>
            <input
              type="password"
              value={pickaxeKey}
              onChange={(e) => setPickaxeKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-4"
              placeholder="Digite a chave..."
              onKeyPress={(e) => e.key === 'Enter' && handlePickaxeAdminAccess()}
            />
            <div className="flex gap-2">
              <Button onClick={handlePickaxeAdminAccess} className="bg-gold-400 text-gray-900 hover:bg-gold-500">
                Continuar
              </Button>
              <Button onClick={() => setShowPickaxePrompt(false)} variant="outline" className="border-gray-600 text-gray-300">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
