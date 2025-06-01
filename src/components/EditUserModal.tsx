
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, Settings, Info, Star } from "lucide-react";

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
    canWithdraw: user.canWithdraw !== false,
    phone: user.phone || '',
    address: user.address || '',
    pixKey: user.pixKey || '',
    notes: user.notes || '',
    affiliateCode: user.affiliateCode || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(user.id, {
        ...formData,
        balance: Number(formData.balance),
        affiliateBalance: Number(formData.affiliateBalance),
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isAffiliate = !!user.affiliateCode;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold-400 text-xl flex items-center gap-2">
            {isAffiliate ? <Star className="h-5 w-5" /> : <User className="h-5 w-5" />}
            Editar {isAffiliate ? 'Afiliado' : 'Usuário'}: {user.username}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifique todos os dados do {isAffiliate ? 'afiliado' : 'usuário'} selecionado
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="basic" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
                <User className="h-4 w-4 mr-1" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
                <DollarSign className="h-4 w-4 mr-1" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
                <Info className="h-4 w-4 mr-1" />
                Contato
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gold-400 data-[state=active]:text-gray-900">
                <Settings className="h-4 w-4 mr-1" />
                Config
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Informações Básicas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Dados principais do {isAffiliate ? 'afiliado' : 'usuário'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Nome de Usuário *</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Status da Conta</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="active">✅ Ativo</SelectItem>
                        <SelectItem value="suspended">🚫 Suspenso</SelectItem>
                        <SelectItem value="pending">⏳ Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isAffiliate && (
                    <div className="space-y-2">
                      <Label htmlFor="affiliateCode" className="text-gold-400">Código de Afiliado</Label>
                      <Input
                        id="affiliateCode"
                        value={formData.affiliateCode}
                        onChange={(e) => handleChange('affiliateCode', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white font-mono"
                        placeholder="CODIGO123"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">Observações Administrativas</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                      placeholder="Adicione observações sobre este usuário..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Gestão Financeira</CardTitle>
                  <CardDescription className="text-gray-400">
                    Controle os saldos e permissões financeiras
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance" className="text-green-400 font-medium">💰 Saldo Principal (MT)</Label>
                      <Input
                        id="balance"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.balance}
                        onChange={(e) => handleChange('balance', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white text-lg font-bold"
                        required
                      />
                      <p className="text-xs text-gray-400">Saldo disponível para mineração e saques</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="affiliateBalance" className="text-gold-400 font-medium">⭐ Saldo de Comissões (MT)</Label>
                      <Input
                        id="affiliateBalance"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.affiliateBalance}
                        onChange={(e) => handleChange('affiliateBalance', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white text-lg font-bold"
                        required
                      />
                      <p className="text-xs text-gray-400">Comissões de afiliados acumuladas</p>
                    </div>
                  </div>

                  <div className="bg-gray-600/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="canWithdraw"
                        checked={formData.canWithdraw}
                        onChange={(e) => handleChange('canWithdraw', e.target.checked)}
                        className="rounded h-4 w-4"
                      />
                      <Label htmlFor="canWithdraw" className="text-white font-medium">
                        🔒 Permitir Saques
                      </Label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Quando desmarcado, o usuário não poderá solicitar saques
                    </p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2">📊 Resumo Financeiro</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Saldo Total:</span>
                        <div className="text-white font-bold">
                          {(Number(formData.balance) + Number(formData.affiliateBalance)).toFixed(2)} MT
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Status Saques:</span>
                        <div className={`font-bold ${formData.canWithdraw ? 'text-green-400' : 'text-red-400'}`}>
                          {formData.canWithdraw ? 'Liberado' : 'Bloqueado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Informações de Contato</CardTitle>
                  <CardDescription className="text-gray-400">
                    Dados para comunicação e pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">📞 Telefone/WhatsApp</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+258 XX XXX XXXX"
                    />
                    <p className="text-xs text-gray-400">Usado para contato sobre saques</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pixKey" className="text-gray-300">💳 Chave PIX</Label>
                    <Input
                      id="pixKey"
                      value={formData.pixKey}
                      onChange={(e) => handleChange('pixKey', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white font-mono"
                      placeholder="email@exemplo.com ou CPF"
                    />
                    <p className="text-xs text-gray-400">Chave PIX para recebimento de saques</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">📍 Endereço</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                      placeholder="Endereço completo para correspondência..."
                    />
                    <p className="text-xs text-gray-400">Usado para envio de correspondências</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Configurações da Conta</CardTitle>
                  <CardDescription className="text-gray-400">
                    Informações técnicas e de controle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <Label className="text-gray-400">ID do Usuário</Label>
                      <div className="bg-gray-600 p-2 rounded font-mono text-gray-300">
                        {user.id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Data de Registro</Label>
                      <div className="bg-gray-600 p-2 rounded text-gray-300">
                        {user.joinDate || 'N/A'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Último Login</Label>
                      <div className="bg-gray-600 p-2 rounded text-gray-300">
                        {user.lastLogin || 'Nunca'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Mineradores Ativos</Label>
                      <div className="bg-gray-600 p-2 rounded text-gray-300">
                        {user.miners?.filter((m: any) => m.isActive).length || 0} / {user.miners?.length || 0}
                      </div>
                    </div>
                  </div>

                  {isAffiliate && (
                    <div className="bg-gold-900/20 border border-gold-700/50 p-4 rounded-lg">
                      <h4 className="text-gold-400 font-medium mb-2">⭐ Estatísticas de Afiliado</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Referidos:</span>
                          <div className="text-white font-bold">
                            {user.affiliateStats?.totalInvited || 0}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Comissões Totais:</span>
                          <div className="text-gold-400 font-bold">
                            {user.affiliateStats?.totalCommissions || 0} MT
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t border-gray-600">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gold-400 text-gray-900 hover:bg-gold-500 flex-1 font-bold py-3"
            >
              {loading ? 'Salvando...' : '💾 Salvar Todas as Alterações'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="border-gray-600 text-gray-300 flex-1 py-3"
              disabled={loading}
            >
              ❌ Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
