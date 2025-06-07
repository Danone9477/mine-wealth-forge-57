
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { DollarSign, User, MessageSquare } from 'lucide-react';

interface ManualDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (email: string, amount: number, description: string) => Promise<void>;
}

const ManualDepositModal = ({ isOpen, onClose, onDeposit }: ManualDepositModalProps) => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !amount || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onDeposit(email, depositAmount, description);
      
      // Limpar formulário
      setEmail('');
      setAmount('');
      setDescription('');
      onClose();
      
      toast({
        title: "✅ Depósito realizado!",
        description: `${depositAmount} MT creditados para ${email}`,
      });
    } catch (error) {
      console.error('Erro ao processar depósito manual:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar depósito. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-400" />
            Depósito Manual
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Creditar saldo manualmente na conta de um usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              Email do Usuário
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor (MT)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Motivo do depósito manual..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loading ? "Processando..." : "Confirmar Depósito"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualDepositModal;
