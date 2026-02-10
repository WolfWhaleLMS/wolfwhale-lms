'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, Plus, Search, Paperclip, Inbox, Star, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationData {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface TeacherMessagesClientProps {
  conversations: ConversationData[];
  currentUserId: string;
  tenantId: string;
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
    case 'parent':
      return 'bg-green-500/20 text-green-700 dark:text-green-300';
    case 'student':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
    case 'teacher':
      return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300';
    default:
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-300';
  }
};

export function TeacherMessagesClient({
  conversations: initialConversations,
  currentUserId,
  tenantId,
}: TeacherMessagesClientProps) {
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState(
    initialConversations.map((c, idx) => ({ ...c, isSelected: idx === 0 }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const selectedConversation = conversations.find((c) => c.isSelected);
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        const messages = (data.data?.messages || data.messages || []).map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_name || 'Unknown',
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          isOwn: msg.sender_id === currentUserId,
        }));
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id, loadMessages]);

  const handleSelectConversation = (id: string) => {
    setConversations(
      conversations.map((c) => ({
        ...c,
        isSelected: c.id === id,
        unreadCount: c.id === id ? 0 : c.unreadCount,
      }))
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: messageInput.trim(),
        }),
      });

      if (res.ok) {
        // Add message optimistically
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'You',
            content: messageInput.trim(),
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            }),
            isOwn: true,
          },
        ]);
        setMessageInput('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
              Messages
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-all duration-200',
                    conversation.isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback
                        className={cn(
                          conversation.isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        )}
                      >
                        {conversation.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={cn(
                            'font-semibold text-sm truncate',
                            conversation.isSelected
                              ? 'text-white'
                              : 'text-slate-900 dark:text-white'
                          )}
                        >
                          {conversation.name}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {conversation.unreadCount > 0 && !conversation.isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                      {conversation.role && (
                        <Badge
                          className={cn(
                            'text-[10px] mb-1',
                            conversation.isSelected
                              ? 'bg-white/20 text-white'
                              : getRoleBadgeColor(conversation.role)
                          )}
                        >
                          {conversation.role}
                        </Badge>
                      )}
                      <p
                        className={cn(
                          'text-xs truncate',
                          conversation.isSelected
                            ? 'text-blue-100'
                            : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      <p
                        className={cn(
                          'text-xs mt-0.5',
                          conversation.isSelected
                            ? 'text-blue-200'
                            : 'text-slate-400 dark:text-slate-500'
                        )}
                      >
                        {conversation.timestamp ? formatTimestamp(conversation.timestamp) : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col gap-4 hidden md:flex">
              {/* Chat Header */}
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {selectedConversation.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {selectedConversation.name}
                      </h3>
                      {selectedConversation.role && (
                        <Badge className={cn('text-xs', getRoleBadgeColor(selectedConversation.role))}>
                          {selectedConversation.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="flex-1 overflow-y-auto">
                <CardContent className="p-6 space-y-4">
                  {loadingMessages ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                      Loading messages...
                    </p>
                  ) : chatMessages.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!message.isOwn && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs">
                              {message.sender[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-md rounded-lg p-3',
                            message.isOwn
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800'
                          )}
                        >
                          {!message.isOwn && (
                            <p className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                              {message.sender}
                            </p>
                          )}
                          <p
                            className={cn(
                              'text-sm',
                              message.isOwn ? 'text-white' : 'text-slate-900 dark:text-white'
                            )}
                          >
                            {message.content}
                          </p>
                          <p
                            className={cn(
                              'text-xs mt-1',
                              message.isOwn ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                            )}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
                      onKeyDown={handleKeyDown}
                      rows={1}
                      className="resize-none"
                    />
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center">
              <div className="text-center">
                <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
