import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AuthPhone from '@/components/AuthPhone';
import CreateGroup from '@/components/CreateGroup';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
  isGroup?: boolean;
  members?: number;
}

interface Message {
  id: number;
  text?: string;
  time: string;
  isMine: boolean;
  encrypted: boolean;
  type: 'text' | 'voice' | 'video';
  duration?: number;
  thumbnail?: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'voice' | 'video' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Встретимся завтра?', time: '14:32', unread: 2, online: true, avatar: 'АС' },
    { id: 2, name: 'Команда проекта', lastMessage: 'Новый дизайн готов', time: '13:15', unread: 0, online: false, avatar: 'КП', isGroup: true, members: 5 },
    { id: 3, name: 'Михаил Иванов', lastMessage: 'Отправил документы', time: '11:20', unread: 1, online: true, avatar: 'МИ' },
    { id: 4, name: 'Елена Петрова', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false, avatar: 'ЕП' },
    { id: 5, name: 'Дмитрий Козлов', lastMessage: 'Созвонимся в 15:00', time: 'Вчера', unread: 0, online: true, avatar: 'ДК' },
  ]);

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false, encrypted: true, type: 'text' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', time: '14:22', isMine: true, encrypted: true, type: 'text' },
    { id: 3, time: '14:25', isMine: false, encrypted: true, type: 'voice', duration: 15 },
    { id: 4, text: 'Конечно! Это приложение для безопасного общения', time: '14:28', isMine: true, encrypted: true, type: 'text' },
    { id: 5, time: '14:30', isMine: true, encrypted: true, type: 'video', duration: 8 },
    { id: 6, text: 'Встретимся завтра?', time: '14:32', isMine: false, encrypted: true, type: 'text' },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const startRecording = async (type: 'voice' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { video: { width: 320, height: 320 }, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Recording saved:', type);
        }
      };
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      
      setIsRecording(false);
      setRecordingType(null);
      setRecordingTime(0);
    }
  };

  const cancelRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    setIsRecording(false);
    setRecordingType(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateGroup = (name: string, members: number[]) => {
    const newGroup: Chat = {
      id: Date.now(),
      name,
      lastMessage: 'Группа создана',
      time: 'Сейчас',
      unread: 0,
      online: false,
      avatar: name.slice(0, 2).toUpperCase(),
      isGroup: true,
      members: members.length + 1
    };
    setChats([newGroup, ...chats]);
    setShowCreateGroup(false);
    setSelectedChat(newGroup.id);
  };

  const currentChat = chats.find(c => c.id === selectedChat);

  if (!isAuthenticated) {
    return <AuthPhone onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-6">
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-sidebar-primary hover:bg-sidebar-primary/90">
          <Icon name="MessageSquare" size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12 rounded-xl hover:bg-sidebar-accent"
          onClick={() => setShowCreateGroup(true)}
        >
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
                  {chat.isGroup ? (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sidebar-primary rounded-full flex items-center justify-center border-2 border-card">
                      <Icon name="Users" size={12} />
                    </div>
                  ) : (
                    chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                      {chat.isGroup && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">({chat.members})</span>
                      )}
                    </div>
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
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{currentChat?.name}</h2>
                {currentChat?.isGroup && (
                  <span className="text-xs text-muted-foreground">({currentChat?.members})</span>
                )}
              </div>
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
                {msg.type === 'text' ? (
                  <div className={`max-w-[70%] ${msg.isMine ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-accent text-accent-foreground'} rounded-2xl px-4 py-2`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-xs opacity-70">{msg.time}</span>
                      {msg.encrypted && <Icon name="Lock" size={12} className="opacity-70" />}
                    </div>
                  </div>
                ) : msg.type === 'voice' ? (
                  <div className={`${msg.isMine ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-accent text-accent-foreground'} rounded-2xl px-4 py-3 flex items-center gap-3`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10">
                      <Icon name="Play" size={16} />
                    </Button>
                    <div className="flex-1">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden w-32">
                        <div className="h-full bg-white/60 w-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs opacity-70">{msg.duration}s</span>
                      {msg.encrypted && <Icon name="Lock" size={12} className="opacity-70 ml-1" />}
                    </div>
                  </div>
                ) : (
                  <div className={`${msg.isMine ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-accent text-accent-foreground'} rounded-full w-32 h-32 flex items-center justify-center relative overflow-hidden group cursor-pointer`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-sidebar-primary to-secondary opacity-50" />
                    <Icon name="Play" size={32} className="relative z-10 group-hover:scale-110 transition-transform" />
                    <div className="absolute bottom-2 right-2 text-xs opacity-70 z-10 flex items-center gap-1">
                      <span>{msg.duration}s</span>
                      {msg.encrypted && <Icon name="Lock" size={10} />}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4 bg-card">
          {!isRecording ? (
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
              <Button 
                onClick={() => startRecording('voice')} 
                size="icon" 
                className="rounded-full bg-accent hover:bg-accent/80"
              >
                <Icon name="Mic" size={20} />
              </Button>
              <Button 
                onClick={() => startRecording('video')} 
                size="icon" 
                className="rounded-full bg-accent hover:bg-accent/80"
              >
                <Icon name="Video" size={20} />
              </Button>
              <Button onClick={handleSendMessage} size="icon" className="rounded-full bg-sidebar-primary hover:bg-sidebar-primary/90">
                <Icon name="Send" size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recordingType === 'video' && (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-black">
                    <video 
                      ref={videoPreviewRef}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 ring-4 ring-sidebar-primary animate-pulse" />
                  </div>
                </div>
              )}
              <div className="flex gap-3 items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-lg font-semibold">{formatTime(recordingTime)}</span>
                  <span className="text-sm text-muted-foreground">
                    {recordingType === 'voice' ? 'Голосовое сообщение' : 'Видео-кружок'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={cancelRecording} 
                    size="icon" 
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Icon name="X" size={20} />
                  </Button>
                  <Button 
                    onClick={stopRecording} 
                    size="icon" 
                    className="rounded-full bg-sidebar-primary hover:bg-sidebar-primary/90"
                  >
                    <Icon name="Check" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          )}
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
            <div className="bg-background rounded-lg p-4 border border-sidebar-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Lock" size={20} className="text-sidebar-primary" />
                <span className="font-semibold">Облачный пароль</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Дополнительная защита для всех устройств</p>
              <Button variant="outline" className="w-full" size="sm">
                Изменить пароль
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCreateGroup && (
        <CreateGroup 
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Index;