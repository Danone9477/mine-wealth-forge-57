
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Phone, MapPin, CreditCard } from "lucide-react";

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

  const isAffiliate = transaction.source === 'affiliate';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gold-400 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Processar Saque {isAffiliate ? 'de Afiliado' : 'de Usuário'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Marque como pago ou rejeite o saque
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Detalhes da transação */}
          <div className="bg-gray-700/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Usuário:</span>
              <span className={`font-medium ${isAffiliate ? 'text-gold-400' : 'text-white'}`}>
                {transaction.username}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email:</span>
              <span className="text-white text-sm">{transaction.email}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Valor:</span>
              <span className="text-gold-400 font-bold text-lg">{transaction.amount} MT</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Método:</span>
              <span className="text-white">{transaction.method || 'N/A'}</span>
            </div>
            
            {/* Dados bancários/contato */}
            <div className="border-t border-gray-600 pt-3 space-y-2">
              <h4 className="text-gray-300 font-medium">Dados para Pagamento:</h4>
              
              {transaction.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">{transaction.phone}</span>
                </div>
              )}
              
              {transaction.pixKey && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  <div>
                    <span className="text-blue-400">PIX: </span>
                    <span className="text-white font-mono text-sm">{transaction.pixKey}</span>
                  </div>
                </div>
              )}
              
              {transaction.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-purple-400 mt-0.5" />
                  <div>
                    <span className="text-purple-400">Endereço: </span>
                    <span className="text-white text-sm">{transaction.address}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Data:</span>
              <span className="text-white text-sm">{transaction.date}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status Atual:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                {transaction.status === 'pending' ? 'Pendente' : transaction.status}
              </Badge>
            </div>
            
            {isAffiliate && (
              <div className="bg-gold-400/10 border border-gold-400/20 rounded p-2">
                <span className="text-gold-400 text-xs font-medium">
                  💰 Este é um saque de comissões de afiliado
                </span>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o processamento (ex: comprovante enviado, dados incorretos, etc.)"
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
              {processing ? 'Processando...' : 'Marcar como Pago'}
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
