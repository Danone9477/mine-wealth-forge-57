
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Phone, MapPin, CreditCard, Star, User, Calendar, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcessWithdrawalModalProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (transactionId: string, status: string, notes?: string) => void;
}

const ProcessWithdrawalModal = ({ transaction, isOpen, onClose, onUpdate }: ProcessWithdrawalModalProps) => {
  const [notes, setNotes] = useState(transaction.notes || '');
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
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold-400 text-xl flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            💰 Processar Saque {isAffiliate ? 'de Afiliado' : 'de Usuário'}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-lg">
            Analise os dados e marque como pago ou rejeite o saque
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Usuário */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {isAffiliate ? <Star className="h-5 w-5 text-gold-400" /> : <User className="h-5 w-5 text-blue-400" />}
                Informações do {isAffiliate ? 'Afiliado' : 'Usuário'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      isAffiliate ? 'bg-gradient-to-br from-gold-400 to-gold-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      {transaction.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className={`font-bold text-xl ${isAffiliate ? 'text-gold-400' : 'text-white'}`}>
                        {transaction.username}
                        {isAffiliate && <span className="text-gold-400 ml-2">⭐</span>}
                      </div>
                      <div className="text-gray-400">{transaction.email}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID da Transação:</span>
                      <span className="text-white font-mono text-sm">{transaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo de Saque:</span>
                      <Badge className={isAffiliate ? 'bg-gold-500/20 text-gold-400 border-gold-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/50'}>
                        {isAffiliate ? '⭐ Comissões de Afiliado' : '💰 Saldo Principal'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-600/50 p-4 rounded-lg text-center">
                    <div className="text-gray-400 text-sm">Valor do Saque</div>
                    <div className="text-gold-400 font-bold text-3xl">{transaction.amount} MT</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data da Solicitação:</span>
                      <span className="text-white">{transaction.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status Atual:</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        ⏳ {transaction.status === 'pending' ? 'Pendente' : transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Bancários/Pagamento */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-400" />
                📋 Dados para Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-medium">Informações de Contato:</h4>
                    
                    {transaction.phone ? (
                      <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                        <Phone className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-green-400 font-medium">Telefone/WhatsApp</div>
                          <div className="text-white font-mono text-lg">{transaction.phone}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <div className="text-red-400">Telefone não informado</div>
                      </div>
                    )}

                    {transaction.method && (
                      <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-blue-400 font-medium">Método de Pagamento</div>
                          <div className="text-white">{transaction.method}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-medium">Dados Bancários:</h4>
                    
                    {transaction.pixKey ? (
                      <div className="flex items-center gap-3 p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                        <CreditCard className="h-5 w-5 text-purple-400" />
                        <div>
                          <div className="text-purple-400 font-medium">Chave PIX</div>
                          <div className="text-white font-mono break-all">{transaction.pixKey}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <div className="text-red-400">Chave PIX não informada</div>
                      </div>
                    )}

                    {transaction.address && (
                      <div className="flex items-start gap-3 p-3 bg-indigo-900/20 border border-indigo-700/50 rounded-lg">
                        <MapPin className="h-5 w-5 text-indigo-400 mt-0.5" />
                        <div>
                          <div className="text-indigo-400 font-medium">Endereço</div>
                          <div className="text-white text-sm">{transaction.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alerta sobre dados faltantes */}
                {(!transaction.phone || !transaction.pixKey) && (
                  <div className="bg-orange-900/20 border border-orange-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-400 font-medium mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      ⚠️ Atenção: Dados Incompletos
                    </div>
                    <div className="text-orange-300 text-sm">
                      Alguns dados essenciais para o pagamento estão faltando. Entre em contato com o usuário antes de processar.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações e Notas */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                📝 Observações e Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transaction.notes && (
                  <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                    <div className="text-blue-400 font-medium mb-2">Observações Anteriores:</div>
                    <div className="text-white">{transaction.notes}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300 font-medium">
                    Adicionar Observações sobre o Processamento:
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Exemplo: 
• Comprovante de pagamento enviado via WhatsApp
• Dados bancários verificados
• Usuário contactado por telefone
• Transferência realizada às 14:30"
                    className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                  />
                  <p className="text-xs text-gray-400">
                    Estas observações ficarão registradas no histórico da transação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Final */}
          {isAffiliate && (
            <div className="bg-gold-900/20 border border-gold-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gold-400 font-medium mb-2">
                <Star className="h-5 w-5" />
                ⭐ Este é um saque de comissões de afiliado
              </div>
              <div className="text-gold-300 text-sm">
                Verifique se o afiliado possui referidos suficientes para justificar o valor solicitado.
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="bg-gray-600/30 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-white font-bold text-lg">Tomar Decisão sobre o Saque</div>
              <div className="text-gray-400">Escolha uma das opções abaixo:</div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => handleProcess('completed')}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-3 py-4 text-lg font-bold"
              >
                <CheckCircle className="h-6 w-6" />
                {processing ? 'Processando...' : '✅ MARCAR COMO PAGO'}
              </Button>
              
              <Button
                onClick={() => handleProcess('rejected')}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 text-white flex-1 flex items-center justify-center gap-3 py-4 text-lg font-bold"
              >
                <XCircle className="h-6 w-6" />
                {processing ? 'Processando...' : '❌ REJEITAR SAQUE'}
              </Button>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="border-gray-600 text-gray-300 w-full mt-4 py-3"
              disabled={processing}
            >
              🔙 Voltar sem Alterar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessWithdrawalModal;
