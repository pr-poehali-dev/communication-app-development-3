import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AuthPhoneProps {
  onAuthSuccess: () => void;
}

export default function AuthPhone({ onAuthSuccess }: AuthPhoneProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleSendCode = () => {
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleVerifyCode = () => {
    if (code.length === 6) {
      setStep('password');
    }
  };

  const handleLogin = () => {
    if (password.length >= 4) {
      onAuthSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-sidebar-primary flex items-center justify-center mb-4">
            <Icon name="MessageSquare" size={40} className="text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Безопасный чат</h1>
          <p className="text-sm text-muted-foreground text-center">
            Сквозное шифрование для ваших сообщений
          </p>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Номер телефона</label>
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <Button 
              onClick={handleSendCode}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90"
              disabled={phone.length < 10}
            >
              Получить код
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Мы отправим вам SMS с кодом подтверждения
            </p>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Код из SMS</label>
              <Input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="bg-background border-border text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            <Button 
              onClick={handleVerifyCode}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90"
              disabled={code.length !== 6}
            >
              Подтвердить
            </Button>
            <Button 
              onClick={() => setStep('phone')}
              variant="ghost"
              className="w-full"
            >
              Изменить номер
            </Button>
          </div>
        )}

        {step === 'password' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg mb-4">
              <Icon name="Shield" size={20} className="text-sidebar-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Облачный пароль</p>
                <p className="text-xs text-muted-foreground">
                  Дополнительная защита для доступа к вашим сообщениям на всех устройствах
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Создайте облачный пароль</label>
              <Input
                type="password"
                placeholder="Минимум 4 символа"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90"
              disabled={password.length < 4}
            >
              Войти в чат
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Пароль зашифрован и хранится в облаке
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
