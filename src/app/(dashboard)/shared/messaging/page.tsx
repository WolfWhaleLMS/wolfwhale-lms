'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, Plus, Search, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isSelected: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderRole: 'teacher' | 'student' | 'parent';
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ms. Chen',
    lastMessage: 'Your math quiz is graded. Great work!',
    timestamp: '2 hours ago',
    unread: 2,
    isSelected: true,
  },
  {
    id: '2',
    name: 'Mr. Patterson',
    lastMessage: 'The essay assignment is due tomorrow',
    timestamp: '1 day ago',
    unread: 0,
    isSelected: false,
  },
  {
    id: '3',
    name: 'Biology Class Group',
    lastMessage: 'Emma: Can you help me with the lab report?',
    timestamp: '2 days ago',
    unread: 0,
    isSelected: false,
  },
  {
    id: '4',
    name: 'Dr. Martinez',
    lastMessage: 'See you in class tomorrow!',
    timestamp: '3 days ago',
    unread: 0,
    isSelected: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Ms. Chen',
    senderRole: 'teacher',
    content: 'Hi! I wanted to check in on how you\'re doing in the class.',
    timestamp: '2 hours ago',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    senderRole: 'student',
    content: 'Hi Ms. Chen! I\'m doing well. The math unit is making more sense now.',
    timestamp: '2 hours ago',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Ms. Chen',
    senderRole: 'teacher',
    content: 'That\'s wonderful to hear! Your quiz score was excellent.',
    timestamp: '2 hours ago',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'Ms. Chen',
    senderRole: 'teacher',
    content: 'Your math quiz is graded. Great work!',
    timestamp: '2 hours ago',
    isOwn: false,
  },
];

export default function MessagingPage() {
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = conversations.find((c) => c.isSelected);
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (id: string) => {
    setConversations(
      conversations.map((c) => ({
        ...c,
        isSelected: c.id === id,
        unread: c.id === id ? 0 : c.unread,
      }))
    );
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, would send message to backend
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Messages
          </h1>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-all duration-200',
                    conversation.isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn(
                          'font-semibold truncate',
                          conversation.isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                        )}>
                          {conversation.name}
                        </h4>
                        {conversation.unread > 0 && (
                          <Badge className={cn(
                            'text-xs',
                            conversation.isSelected
                              ? 'bg-white text-purple-600'
                              : 'bg-purple-600 text-white'
                          )}>
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        'text-xs truncate',
                        conversation.isSelected
                          ? 'text-purple-100'
                          : 'text-slate-600 dark:text-slate-400'
                      )}>
                        {conversation.lastMessage}
                      </p>
                      <p className={cn(
                        'text-xs mt-1',
                        conversation.isSelected
                          ? 'text-purple-100'
                          : 'text-slate-500 dark:text-slate-500'
                      )}>
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation && (
            <div className="flex-1 flex flex-col gap-4 hidden md:flex">
              {/* Chat Header */}
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Active now
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="flex-1 overflow-y-auto">
                <CardContent className="p-6 space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.isOwn ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{message.sender[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-xs rounded-lg p-3',
                          message.isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800'
                        )}
                      >
                        {!message.isOwn && (
                          <p className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                            {message.sender}
                          </p>
                        )}
                        <p className={cn(
                          'text-sm',
                          message.isOwn ? 'text-white' : 'text-slate-900 dark:text-white'
                        )}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      rows={1}
                      className="resize-none"
                    />
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
