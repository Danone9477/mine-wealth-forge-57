
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface ProcessWithdrawalModalProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (transactionId: string, status: string, notes?: string) => void;
}

const ProcessWithdrawalModal = ({ transaction, isOpen, onClose, onUpdate }: ProcessWithdrawalModalProps) => {
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (status: 'completed' | 'rejected') => {
    setProcessing(true);
    try {
      await onUpdate(transaction.id, status, notes);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold-400">Processar Saque</DialogTitle>
          <DialogDescription className="text-gray-400">
            Aprove ou rejeite o saque do usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Detalhes da transação */}
          <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Usuário:</span>
              <span className="text-white font-medium">{transaction.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Valor:</span>
              <span className="text-gold-400 font-bold">{transaction.amount} MT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Método:</span>
              <span className="text-white">{transaction.method || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Telefone:</span>
              <span className="text-white">{transaction.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data:</span>
              <span className="text-white">{transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                {transaction.status}
              </Badge>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o processamento..."
              className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => handleProcess('completed')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {processing ? 'Processando...' : 'Aprovar'}
            </Button>
            <Button
              onClick={() => handleProcess('rejected')}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white flex-1 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              {processing ? 'Processando...' : 'Rejeitar'}
            </Button>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-600 text-gray-300 w-full"
            disabled={processing}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessWithdrawalModal;
