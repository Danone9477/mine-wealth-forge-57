
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditUserModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, data: any) => void;
}

const EditUserModal = ({ user, isOpen, onClose, onUpdate }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    balance: user.balance || 0,
    affiliateBalance: user.affiliateBalance || 0,
    status: user.status || 'active',
    canWithdraw: user.canWithdraw !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, {
      ...formData,
      balance: Number(formData.balance),
      affiliateBalance: Number(formData.affiliateBalance)
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold-400">Editar Usuário</DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifique os dados do usuário selecionado
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Nome de Usuário</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-gray-300">Saldo (MT)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => handleChange('balance', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateBalance" className="text-gray-300">Saldo de Afiliado (MT)</Label>
            <Input
              id="affiliateBalance"
              type="number"
              step="0.01"
              value={formData.affiliateBalance}
              onChange={(e) => handleChange('affiliateBalance', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="canWithdraw"
              checked={formData.canWithdraw}
              onChange={(e) => handleChange('canWithdraw', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="canWithdraw" className="text-gray-300">Pode fazer saques</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-gold-400 text-gray-900 hover:bg-gold-500 flex-1">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
