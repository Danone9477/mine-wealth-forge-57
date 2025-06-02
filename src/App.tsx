
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Miners from "./pages/Miners";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Affiliates from "./pages/Affiliates";
import History from "./pages/History";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { cronService } from "@/services/cronService";

const queryClient = new QueryClient();

// Componente para debug de rotas
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    console.log('Location state:', location.state);
    console.log('Search params:', location.search);
  }, [location]);
  
  return null;
};

const App = () => {
  useEffect(() => {
    // Inicializar serviço de processamento automático
    cronService.start();
    
    // Log inicial para debug
    console.log('App initialized');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    return () => {
      cronService.stop();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteLogger />
            <div className="min-h-screen">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/miners" element={<Miners />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/affiliates" element={<Affiliates />} />
                <Route path="/history" element={<History />} />
                <Route path="/admin" element={<Admin />} />
                {/* CATCH-ALL ROUTE - DEVE SER A ÚLTIMA */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
