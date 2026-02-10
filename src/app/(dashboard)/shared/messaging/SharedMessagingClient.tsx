'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, Plus, Search, Paperclip, Smile, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationData {
  id: string;
  name: string;
  avatar?: string;
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

interface SharedMessagingClientProps {
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

export function SharedMessagingClient({
  conversations: initialConversations,
  currentUserId,
  tenantId,
}: SharedMessagingClientProps) {
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
      const res = await fetch(`/api/messages/${selectedConversation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
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
                      <AvatarFallback
                        className={cn(
                          conversation.isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
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
                        <h4 className={cn(
                          'font-semibold truncate',
                          conversation.isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                        )}>
                          {conversation.name}
                        </h4>
                        {conversation.unreadCount > 0 && !conversation.isSelected && (
                          <Badge className={cn(
                            'text-xs',
                            'bg-purple-600 text-white'
                          )}>
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        'text-xs truncate',
                        conversation.isSelected
                          ? 'text-purple-100'
                          : 'text-slate-600 dark:text-slate-400'
                      )}>
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      <p className={cn(
                        'text-xs mt-1',
                        conversation.isSelected
                          ? 'text-purple-100'
                          : 'text-slate-500 dark:text-slate-500'
                      )}>
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
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
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
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs">
                              {message.sender[0]}
                            </AvatarFallback>
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
                          <p className={cn(
                            'text-xs mt-1',
                            message.isOwn ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500'
                          )}>
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
                      className="bg-purple-600 hover:bg-purple-700 text-white"
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
