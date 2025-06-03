
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface AdminAccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAccess = ({ isOpen, onClose }: AdminAccessProps) => {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessKey === 'HAPPYMINE') {
      console.log('Acesso administrativo autorizado');
      onClose();
      navigate('/admin');
    } else {
      setError('Chave de acesso inválida');
      setAccessKey('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAccessKey('');
      setError('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold-400">
            <Shield className="h-5 w-5" />
            Acesso Administrativo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Digite a chave de acesso"
              value={accessKey}
              onChange={(e) => {
                setAccessKey(e.target.value);
                setError('');
              }}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700"
            >
              Acessar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccess;
