import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  encrypted: boolean;
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Встретимся завтра?', time: '14:32', unread: 2, online: true, avatar: 'АС' },
    { id: 2, name: 'Команда проекта', lastMessage: 'Новый дизайн готов', time: '13:15', unread: 0, online: false, avatar: 'КП' },
    { id: 3, name: 'Михаил Иванов', lastMessage: 'Отправил документы', time: '11:20', unread: 1, online: true, avatar: 'МИ' },
    { id: 4, name: 'Елена Петрова', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false, avatar: 'ЕП' },
    { id: 5, name: 'Дмитрий Козлов', lastMessage: 'Созвонимся в 15:00', time: 'Вчера', unread: 0, online: true, avatar: 'ДК' },
  ];

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false, encrypted: true },
    { id: 2, text: 'Отлично! Работаю над новым проектом', time: '14:22', isMine: true, encrypted: true },
    { id: 3, text: 'Звучит интересно! Расскажешь подробнее?', time: '14:25', isMine: false, encrypted: true },
    { id: 4, text: 'Конечно! Это приложение для безопасного общения', time: '14:28', isMine: true, encrypted: true },
    { id: 5, text: 'Встретимся завтра?', time: '14:32', isMine: false, encrypted: true },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const currentChat = chats.find(c => c.id === selectedChat);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-6">
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-sidebar-primary hover:bg-sidebar-primary/90">
          <Icon name="MessageSquare" size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-sidebar-accent">
          <Icon name="Users" size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-sidebar-accent">
          <Icon name="Bell" size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-sidebar-accent" onClick={() => setShowProfile(!showProfile)}>
          <Icon name="User" size={24} />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-sidebar-accent">
          <Icon name="Settings" size={24} />
        </Button>
      </div>

      {/* Chat List */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Поиск чатов..." className="pl-10 bg-background border-border" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 cursor-pointer transition-all hover:bg-accent border-b border-border ${selectedChat === chat.id ? 'bg-accent' : ''}`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-full px-2 min-w-[20px] h-5 flex items-center justify-center">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">{currentChat?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{currentChat?.name}</h2>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Shield" size={12} className="text-green-500" />
                <span>Сквозное шифрование</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[70%] ${msg.isMine ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-accent text-accent-foreground'} rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-xs opacity-70">{msg.time}</span>
                    {msg.encrypted && <Icon name="Lock" size={12} className="opacity-70" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-3 items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Paperclip" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Smile" size={20} />
            </Button>
            <Input
              placeholder="Введите сообщение..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-background border-border"
            />
            <Button onClick={handleSendMessage} size="icon" className="rounded-full bg-sidebar-primary hover:bg-sidebar-primary/90">
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      {showProfile && (
        <div className="w-80 bg-card border-l border-border p-6 animate-slide-in-right">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Профиль</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-2xl">ВЫ</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">Вы</h3>
            <p className="text-sm text-muted-foreground">@your_username</p>
          </div>
          <div className="space-y-4">
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={20} className="text-green-500" />
                <span className="font-semibold">Безопасность</span>
              </div>
              <p className="text-sm text-muted-foreground">Все сообщения защищены сквозным шифрованием</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Bell" size={20} className="text-sidebar-primary" />
                <span className="font-semibold">Уведомления</span>
              </div>
              <p className="text-sm text-muted-foreground">Настройте оповещения</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Eye" size={20} className="text-sidebar-primary" />
                <span className="font-semibold">Приватность</span>
              </div>
              <p className="text-sm text-muted-foreground">Управление доступом к данным</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;