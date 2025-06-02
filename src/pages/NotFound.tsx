
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    console.log("Current location state:", location.state);
    console.log("Search params:", location.search);
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gold-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
          <p className="text-gray-400 mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="text-sm text-gray-500 bg-gray-800 p-3 rounded-md mb-6">
            <strong>Rota atual:</strong> {location.pathname}
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <Link to="/">
            <Button className="w-full bg-gold-400 text-gray-900 hover:bg-gold-500">
              <Home className="h-4 w-4 mr-2" />
              Ir para o Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
