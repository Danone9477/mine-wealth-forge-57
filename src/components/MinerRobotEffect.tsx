
import { useState, useEffect } from 'react';

const MinerRobotEffect = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Animação de entrada após 1 segundo
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
      {/* Robô Minerador */}
      <div className={`relative transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Efeito de Brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Container do Robô */}
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-4 border border-gold-400/30 shadow-2xl backdrop-blur-sm">
          {/* Partículas de Mineração */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-gold-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-green-400 rounded-full animate-ping animation-delay-500"></div>
          
          {/* Corpo do Robô */}
          <div className="w-16 h-16 relative">
            {/* Cabeça */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-lg border border-gray-600">
              {/* Olhos */}
              <div className="flex justify-between items-center h-full px-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
              </div>
              {/* Antena */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gold-400"></div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce"></div>
            </div>
            
            {/* Torso */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded border border-gray-700">
              {/* Painel de Controle */}
              <div className="flex justify-center items-center h-full">
                <div className="w-6 h-4 bg-gray-800 rounded border border-gray-600 flex items-center justify-center">
                  <div className="text-green-400 text-xs font-mono animate-pulse">$</div>
                </div>
              </div>
            </div>
            
            {/* Braços */}
            <div className="absolute top-8 -left-1 w-3 h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform rotate-12"></div>
            <div className="absolute top-8 -right-1 w-3 h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform -rotate-12"></div>
            
            {/* Ferramenta de Mineração */}
            <div className="absolute top-6 -right-3 w-2 h-4 bg-gold-400 rounded transform rotate-45 animate-bounce animation-delay-100"></div>
            
            {/* Base/Pernas */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b border border-gray-700"></div>
          </div>
          
          {/* Texto de Status */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-gray-900/90 text-gold-400 text-xs px-2 py-1 rounded border border-gold-400/30 animate-pulse">
              ⛏️ Minerando...
            </div>
          </div>
          
          {/* Efeitos de Moedas */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-gold-400 rounded-full animate-bounce animation-delay-700 opacity-70"></div>
          </div>
          <div className="absolute -top-5 left-1/3 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-gold-300 rounded-full animate-bounce animation-delay-900 opacity-50"></div>
          </div>
          <div className="absolute -top-4 right-1/3 transform translate-x-1/2">
            <div className="w-2.5 h-2.5 bg-gold-500 rounded-full animate-bounce animation-delay-1100 opacity-60"></div>
          </div>
        </div>
        
        {/* Botão para fechar (opcional) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-xs transition-colors pointer-events-auto"
          title="Fechar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default MinerRobotEffect;
