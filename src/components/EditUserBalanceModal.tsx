
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, User, Save, X } from "lucide-react";

interface EditUserBalanceModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBalance: (userId: string, newBalance: number) => void;
}

const EditUserBalanceModal = ({ user, isOpen, onClose, onUpdateBalance }: EditUserBalanceModalProps) => {
  const [newBalance, setNewBalance] = useState(user?.balance || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await onUpdateBalance(user.id, Number(newBalance));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold-400 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Editar Saldo do Usuário
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Altere o saldo atual do usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Usuário */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-bold text-white">{user?.username}</div>
                <div className="text-gray-400 text-sm">{user?.email}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Saldo Atual:</span>
                <span className="text-gold-400 font-bold">{user?.balance} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Ganhos:</span>
                <span className="text-green-400">{user?.totalEarnings || 0} MT</span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="balance" className="text-gray-300 font-medium">
                Novo Saldo (MT):
              </Label>
              <Input
                id="balance"
                type="number"
                min="0"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-lg font-bold"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-400">
                Digite o novo valor do saldo para este usuário
              </p>
            </div>

            {/* Diferença */}
            {newBalance !== user?.balance && (
              <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded-lg">
                <div className="text-blue-400 font-medium text-sm mb-1">Alteração:</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">De: {user?.balance} MT</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-gold-400 font-bold">Para: {newBalance} MT</span>
                </div>
                <div className="text-center mt-2">
                  <span className={`font-bold ${Number(newBalance) > user?.balance ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(newBalance) > user?.balance ? '+' : ''}{(Number(newBalance) - user?.balance).toFixed(2)} MT
                  </span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUpdating || newBalance === user?.balance}
                className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Salvando...' : 'Salvar Saldo'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="border-gray-600 text-gray-300 flex items-center gap-2"
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>

          {/* Aviso */}
          <div className="bg-orange-900/20 border border-orange-700/50 p-3 rounded-lg">
            <div className="text-orange-400 text-xs font-medium">⚠️ Atenção:</div>
            <div className="text-orange-300 text-xs mt-1">
              Esta ação alterará permanentemente o saldo do usuário no Firebase.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserBalanceModal;
