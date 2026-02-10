'use client';

import * as React from 'react';
import { Bell, Moon, Sun, Search, LogOut, Settings, HelpCircle, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../common/SearchInput';
import { Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs';
import { UserRole } from '@/types';

export interface TopNavProps {
  notificationCount?: number;
  userRole?: UserRole;
  userInitials?: string;
  userImage?: string;
  userName?: string;
  userXP?: number;
  userCoins?: number;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  breadcrumbItems?: BreadcrumbsProps['items'];
}

export function TopNav({
  notificationCount = 0,
  userRole = 'student',
  userInitials = 'JD',
  userImage,
  userName = 'John Doe',
  userXP = 0,
  userCoins = 0,
  onSearch,
  onLogout,
  breadcrumbItems,
}: TopNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 right-0 h-16 flex items-center justify-between border-b',
        'glass backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-white/30 dark:border-slate-800/50',
        'z-30 px-6 shadow-lg'
      )}
      style={{
        width: 'calc(100% - 280px)',
      }}
    >
      {/* Left: Breadcrumbs */}
      <div className="hidden md:flex flex-1 items-center">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md px-4 hidden sm:block">
        <SearchInput onSearch={onSearch} showShortcut placeholder="Search..." />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Student Stats */}
        {userRole === 'student' && (
          <div className="hidden lg:flex items-center gap-3">
            {userXP !== undefined && (
              <Badge variant="xp" size="sm">
                {userXP.toLocaleString()} XP
              </Badge>
            )}
            {userCoins !== undefined && (
              <Badge variant="secondary" size="sm">
                {userCoins} Coins
              </Badge>
            )}
          </div>
        )}

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/20 dark:hover:bg-slate-800/50"
        >
          <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </motion.button>

        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/20 dark:hover:bg-slate-800/50"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
          </motion.button>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <Avatar size="sm">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{userName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{userRole.replace('_', ' ')}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
