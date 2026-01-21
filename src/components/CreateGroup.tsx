import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Contact {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

interface CreateGroupProps {
  onClose: () => void;
  onCreate: (name: string, members: number[]) => void;
}

export default function CreateGroup({ onClose, onCreate }: CreateGroupProps) {
  const [step, setStep] = useState<'members' | 'info'>('members');
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    { id: 1, name: 'Анна Смирнова', avatar: 'АС', online: true },
    { id: 2, name: 'Михаил Иванов', avatar: 'МИ', online: true },
    { id: 3, name: 'Елена Петрова', avatar: 'ЕП', online: false },
    { id: 4, name: 'Дмитрий Козлов', avatar: 'ДК', online: true },
    { id: 5, name: 'Ольга Новикова', avatar: 'ОН', online: false },
    { id: 6, name: 'Сергей Волков', avatar: 'СВ', online: true },
  ];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (id: number) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedMembers.length >= 2) {
      setStep('info');
    }
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length >= 2) {
      onCreate(groupName, selectedMembers);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-md max-h-[80vh] flex flex-col border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {step === 'members' ? 'Добавить участников' : 'Информация о группе'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {step === 'members' ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск контактов..." 
                  className="pl-10 bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {selectedMembers.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Выбрано: {selectedMembers.length}
                </p>
              )}
            </div>

            <ScrollArea className="flex-1">
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => toggleMember(contact.id)}
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors border-b border-border"
                >
                  <Checkbox 
                    checked={selectedMembers.includes(contact.id)}
                    className="border-border"
                  />
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {contact.online ? 'В сети' : 'Не в сети'}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <Button 
                onClick={handleNext}
                className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90"
                disabled={selectedMembers.length < 2}
              >
                Далее ({selectedMembers.length})
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-sidebar-primary/20 flex items-center justify-center cursor-pointer hover:bg-sidebar-primary/30 transition-colors">
                  <Icon name="Camera" size={32} className="text-sidebar-primary" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Название группы</label>
                <Input
                  placeholder="Введите название..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Users" size={20} className="text-sidebar-primary" />
                  <span className="font-medium text-sm">Участники: {selectedMembers.length + 1}</span>
                </div>
                <div className="flex -space-x-2">
                  {selectedMembers.slice(0, 5).map(id => {
                    const contact = contacts.find(c => c.id === id);
                    return contact ? (
                      <Avatar key={id} className="w-8 h-8 border-2 border-card">
                        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                          {contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ) : null;
                  })}
                  {selectedMembers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-accent border-2 border-card flex items-center justify-center text-xs">
                      +{selectedMembers.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Shield" size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Сквозное шифрование</p>
                    <p className="text-xs text-muted-foreground">
                      Все сообщения в группе защищены шифрованием
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <Button 
                onClick={() => setStep('members')}
                variant="outline"
                className="flex-1"
              >
                Назад
              </Button>
              <Button 
                onClick={handleCreate}
                className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90"
                disabled={!groupName.trim()}
              >
                Создать группу
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
