'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, Plus, Search, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface ConversationItem {
  id: string;
  type: string;
  subject: string | null;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  members: Array<{
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  }>;
}

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

interface InitialData {
  conversations: ConversationItem[];
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface MessagesPageClientProps {
  initialData: InitialData;
}

export function MessagesPageClient({ initialData }: MessagesPageClientProps) {
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialData.conversations[0]?.id || null
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const conversations = initialData.conversations;
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch messages when a conversation is selected
  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!msgData) {
        setMessages([]);
        return;
      }

      // Get sender profiles
      const senderIds = [...new Set(msgData.map((m) => m.sender_id))];
      const { data: profiles } = senderIds.length
        ? await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', senderIds)
        : { data: [] };

      const profileMap = new Map(
        (profiles || []).map((p) => [p.id, p])
      );

      setMessages(
        msgData.map((m) => {
          const sender = profileMap.get(m.sender_id);
          return {
            id: m.id,
            senderId: m.sender_id,
            senderName: sender
              ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim()
              : 'Unknown',
            senderAvatar: sender?.avatar_url || null,
            content: m.content,
            createdAt: m.created_at,
            isOwn: m.sender_id === user.id,
          };
        })
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId, fetchMessages]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('messages').insert({
        conversation_id: selectedConversationId,
        sender_id: user.id,
        content: messageInput.trim(),
      });

      if (!error) {
        setMessageInput('');
        // Refetch messages
        fetchMessages(selectedConversationId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Messages</h1>
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
              {filteredConversations.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No conversations yet.
                </p>
              ) : (
                filteredConversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-all duration-200',
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-700/50 text-slate-900 dark:text-white'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar || undefined} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={cn(
                                'font-semibold truncate',
                                isSelected
                                  ? 'text-white'
                                  : 'text-slate-900 dark:text-white'
                              )}
                            >
                              {conversation.name}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                className={cn(
                                  'text-xs',
                                  isSelected
                                    ? 'bg-white text-purple-600'
                                    : 'bg-purple-600 text-white'
                                )}
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p
                            className={cn(
                              'text-xs truncate',
                              isSelected
                                ? 'text-purple-100'
                                : 'text-slate-600 dark:text-slate-400'
                            )}
                          >
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                          <p
                            className={cn(
                              'text-xs mt-1',
                              isSelected
                                ? 'text-purple-100'
                                : 'text-slate-500 dark:text-slate-500'
                            )}
                          >
                            {conversation.lastMessageAt
                              ? timeAgo(conversation.lastMessageAt)
                              : ''}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation && (
            <div className="flex-1 flex flex-col gap-4 hidden md:flex">
              {/* Chat Header */}
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar || undefined} />
                      <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {selectedConversation.type === 'group' ? 'Group Chat' : 'Direct Message'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30">
                <CardContent className="p-6 space-y-4">
                  {loadingMessages ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                      Loading messages...
                    </p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!message.isOwn && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.senderAvatar || undefined} />
                            <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-xs rounded-lg p-3',
                            message.isOwn
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-white/30 dark:border-slate-600/30'
                          )}
                        >
                          {!message.isOwn && (
                            <p className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                              {message.senderName}
                            </p>
                          )}
                          <p
                            className={cn(
                              'text-sm',
                              message.isOwn
                                ? 'text-white'
                                : 'text-slate-900 dark:text-white'
                            )}
                          >
                            {message.content}
                          </p>
                          <p
                            className={cn(
                              'text-xs mt-1 opacity-60',
                              message.isOwn ? 'text-white' : 'text-slate-500'
                            )}
                          >
                            {timeAgo(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
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
