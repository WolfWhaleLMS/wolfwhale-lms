'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg liquid-glass backdrop-blur-md bg-white/30 dark:bg-white/5 border border-[#00BFFF]/20 dark:border-[#00BFFF]/15 p-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-white transition-all duration-300 relative overflow-hidden',
      'text-[#6B8FA3] dark:text-[#6B8FA3]',
      'hover:text-[#0A2540] dark:hover:text-white',
      'hover:bg-gradient-to-b hover:from-white/20 hover:to-white/5 hover:border-white/20',
      'border border-transparent',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:sidebar-chrome-tab-active data-[state=active]:text-white data-[state=active]:bg-gradient-to-b data-[state=active]:from-[rgba(51,255,51,0.20)] data-[state=active]:to-[rgba(51,255,51,0.10)] data-[state=active]:border-[rgba(51,255,51,0.30)] data-[state=active]:shadow-[0_0_15px_rgba(51,255,51,0.25),0_0_30px_rgba(51,255,51,0.10),inset_0_1px_0_rgba(255,255,255,0.25)]',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2',
      'animate-fade-in',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
