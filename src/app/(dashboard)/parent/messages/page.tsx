'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Plus,
  Search,
  Paperclip,
  MessageSquare,
  Users,
  ChevronLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

// --- Types ---

interface Conversation {
  id: string;
  name: string;
  role: string;
  subject: string;
  childName: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

// --- Mock Data ---

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Ms. Chen',
    role: 'Math Teacher',
    subject: 'Algebra II',
    childName: 'Emma',
    avatar: null,
    lastMessage: "Emma's quiz score improved significantly this week!",
    timestamp: '10 min ago',
    unread: 2,
    online: true,
  },
  {
    id: 'conv-2',
    name: 'Mr. Patterson',
    role: 'English Teacher',
    subject: 'English Literature',
    childName: 'Emma',
    avatar: null,
    lastMessage: 'The essay is due this Friday. Emma has submitted a draft.',
    timestamp: '2 hours ago',
    unread: 0,
    online: true,
  },
  {
    id: 'conv-3',
    name: 'Dr. Martinez',
    role: 'Science Teacher',
    subject: 'Biology I',
    childName: 'Emma',
    avatar: null,
    lastMessage: 'Lab report feedback has been posted.',
    timestamp: '1 day ago',
    unread: 1,
    online: false,
  },
  {
    id: 'conv-4',
    name: 'Mr. Williams',
    role: 'Math Teacher',
    subject: 'Pre-Algebra',
    childName: 'Noah',
    avatar: null,
    lastMessage: "Noah has been doing much better with fractions lately.",
    timestamp: '2 days ago',
    unread: 0,
    online: false,
  },
  {
    id: 'conv-5',
    name: 'Mrs. Taylor',
    role: 'English Teacher',
    subject: 'English 7',
    childName: 'Noah',
    avatar: null,
    lastMessage: "Book report guidelines have been shared in class.",
    timestamp: '3 days ago',
    unread: 0,
    online: false,
  },
  {
    id: 'conv-6',
    name: 'Mrs. Davis',
    role: 'Math Teacher',
    subject: 'Math 4',
    childName: 'Olivia',
    avatar: null,
    lastMessage: 'Olivia got a perfect score on the multiplication quiz!',
    timestamp: '4 days ago',
    unread: 0,
    online: true,
  },
];

const mockMessagesByConv: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm1',
      sender: 'Ms. Chen',
      content:
        "Good morning! I wanted to share some good news about Emma's performance in Algebra II.",
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: 'm2',
      sender: 'You',
      content: "That's great to hear! She's been studying hard this week. What happened?",
      timestamp: '10:32 AM',
      isOwn: true,
    },
    {
      id: 'm3',
      sender: 'Ms. Chen',
      content:
        "Emma scored a 94% on the Quadratic Equations quiz, up from 88% on the last one. She's really grasping the material well.",
      timestamp: '10:35 AM',
      isOwn: false,
    },
    {
      id: 'm4',
      sender: 'You',
      content: "That's wonderful! Is there anything we should focus on at home to keep the momentum going?",
      timestamp: '10:37 AM',
      isOwn: true,
    },
    {
      id: 'm5',
      sender: 'Ms. Chen',
      content:
        "The Polynomial Functions test is coming up on Feb 14th. I'd recommend practicing the review problems in Chapter 5. Emma's quiz score improved significantly this week!",
      timestamp: '10:40 AM',
      isOwn: false,
    },
  ],
  'conv-2': [
    {
      id: 'm6',
      sender: 'Mr. Patterson',
      content:
        "Hi there! Just wanted to let you know that Emma submitted her Great Gatsby essay draft.",
      timestamp: 'Yesterday 3:00 PM',
      isOwn: false,
    },
    {
      id: 'm7',
      sender: 'You',
      content: 'Thank you for letting me know. When will the final version be due?',
      timestamp: 'Yesterday 3:15 PM',
      isOwn: true,
    },
    {
      id: 'm8',
      sender: 'Mr. Patterson',
      content:
        'The essay is due this Friday. Emma has submitted a draft.',
      timestamp: 'Yesterday 3:20 PM',
      isOwn: false,
    },
  ],
  'conv-3': [
    {
      id: 'm9',
      sender: 'Dr. Martinez',
      content:
        "Hello! I've posted feedback on Emma's cell division lab report. She did a great job on the analysis section.",
      timestamp: 'Feb 7, 2:00 PM',
      isOwn: false,
    },
    {
      id: 'm10',
      sender: 'You',
      content: 'Thank you, Dr. Martinez. Were there any areas for improvement?',
      timestamp: 'Feb 7, 2:30 PM',
      isOwn: true,
    },
    {
      id: 'm11',
      sender: 'Dr. Martinez',
      content:
        'Lab report feedback has been posted.',
      timestamp: 'Feb 7, 3:00 PM',
      isOwn: false,
    },
  ],
  'conv-4': [
    {
      id: 'm12',
      sender: 'Mr. Williams',
      content:
        "Noah has been doing much better with fractions lately.",
      timestamp: 'Feb 6, 1:00 PM',
      isOwn: false,
    },
  ],
  'conv-5': [
    {
      id: 'm13',
      sender: 'Mrs. Taylor',
      content: "Book report guidelines have been shared in class.",
      timestamp: 'Feb 5, 10:00 AM',
      isOwn: false,
    },
  ],
  'conv-6': [
    {
      id: 'm14',
      sender: 'Mrs. Davis',
      content: 'Olivia got a perfect score on the multiplication quiz!',
      timestamp: 'Feb 4, 11:00 AM',
      isOwn: false,
    },
    {
      id: 'm15',
      sender: 'You',
      content: "That's amazing! She'll be so happy when I tell her we know. Thank you!",
      timestamp: 'Feb 4, 11:30 AM',
      isOwn: true,
    },
  ],
};

// --- Component ---

export default function ParentMessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const messages = mockMessagesByConv[selectedConvId] || [];

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const childGroups = filteredConversations.reduce<Record<string, Conversation[]>>(
    (groups, conv) => {
      if (!groups[conv.childName]) groups[conv.childName] = [];
      groups[conv.childName].push(conv);
      return groups;
    },
    {}
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    setShowMobileChat(true);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Messages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Communicate with your children&apos;s teachers
            {totalUnread > 0 && (
              <Badge className="ml-2 bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {totalUnread} unread
              </Badge>
            )}
          </motion.p>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Conversations Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              'w-full md:w-96 flex flex-col gap-4 flex-shrink-0',
              showMobileChat && 'hidden md:flex'
            )}
          >
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search teachers, children, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Button variant="outline" size="icon" title="New message">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Conversation list grouped by child */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {Object.entries(childGroups).map(([childName, convs]) => (
                <div key={childName}>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
                    <Users className="w-3 h-3 inline mr-1" />
                    {childName}&apos;s Teachers
                  </p>
                  <div className="space-y-1">
                    {convs.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={cn(
                          'w-full p-3 rounded-xl text-left transition-all duration-200',
                          conv.id === selectedConvId
                            ? 'glass backdrop-blur-xl bg-emerald-50/80 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700 shadow-md'
                            : 'hover:bg-white/50 dark:hover:bg-slate-800/30 border-2 border-transparent'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <Avatar size="default">
                              <AvatarImage src={conv.avatar || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs">
                                {conv.name
                                  .split(' ')
                                  .map((w) => w[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conv.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {conv.name}
                              </h4>
                              {conv.unread > 0 && (
                                <Badge className="bg-emerald-500 text-white flex-shrink-0" size="sm">
                                  {conv.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                              {conv.role} &middot; {conv.subject}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                              {conv.lastMessage}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                              {conv.timestamp}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No conversations found.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'flex-1 flex flex-col min-h-0',
              !showMobileChat && 'hidden md:flex'
            )}
          >
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <Card className="flex-shrink-0 mb-4">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowMobileChat(false)}
                        className="md:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                      </button>
                      <div className="relative">
                        <Avatar size="default">
                          <AvatarImage src={selectedConv.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs">
                            {selectedConv.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {selectedConv.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedConv.role} &middot; {selectedConv.subject} &middot;{' '}
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Re: {selectedConv.childName}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className={
                        selectedConv.online
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : ''
                      }
                    >
                      {selectedConv.online ? 'Online' : 'Offline'}
                    </Badge>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="flex-1 overflow-y-auto mb-4">
                  <CardContent className="p-6 space-y-4">
                    {/* Date separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Recent Messages
                      </span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </div>

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'flex gap-3',
                          message.isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!message.isOwn && (
                          <Avatar size="sm" className="flex-shrink-0 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs">
                              {message.sender[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-sm rounded-2xl px-4 py-3',
                            message.isOwn
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'glass backdrop-blur-md bg-white/70 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 rounded-bl-md'
                          )}
                        >
                          {!message.isOwn && (
                            <p className="text-xs font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
                              {message.sender}
                            </p>
                          )}
                          <p
                            className={cn(
                              'text-sm leading-relaxed',
                              message.isOwn
                                ? 'text-white'
                                : 'text-slate-800 dark:text-slate-200'
                            )}
                          >
                            {message.content}
                          </p>
                          <p
                            className={cn(
                              'text-[10px] mt-1.5',
                              message.isOwn
                                ? 'text-emerald-200'
                                : 'text-slate-400 dark:text-slate-500'
                            )}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>
                </Card>

                {/* Message Input */}
                <Card className="flex-shrink-0">
                  <CardContent className="p-4">
                    <div className="flex items-end gap-3">
                      <Button variant="ghost" size="icon" className="flex-shrink-0 mb-0.5" title="Attach file">
                        <Paperclip className="w-4 h-4 text-slate-500" />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          placeholder={`Message ${selectedConv.name} about ${selectedConv.childName}...`}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          rows={1}
                          className="resize-none min-h-[40px]"
                        />
                      </div>
                      <Button
                        size="icon"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0 mb-0.5"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        title="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 ml-12">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Choose a teacher from the sidebar to start messaging.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
