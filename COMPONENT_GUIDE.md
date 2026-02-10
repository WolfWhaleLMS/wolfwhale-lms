# Wolf Whale LMS - Component Guide

## Overview

This guide covers all UI and layout components built for Wolf Whale LMS using the Liquid Glass aesthetic. The design system features frosted glass cards, soft gradients, subtle animations, and rounded corners that create a modern, playful interface for K-12 education.

## Design Philosophy

- **Liquid Glass**: Frosted glass effects with backdrop blur, transparency, and soft shadows
- **Playful**: Student-facing components with bright colors, bouncy animations, and rounded corners
- **Professional**: Teacher/admin components with clean aesthetics and smooth transitions
- **Responsive**: Mobile-first design with proper breakpoints
- **Accessible**: Full ARIA labels, keyboard navigation, and semantic HTML

## Core Dependencies

- **React 18.3.1** - UI framework
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion 11.15.0** - Smooth animations
- **Class Variance Authority 0.7.1** - Component variants
- **Lucide React 0.469.0** - Icon library

## UI Components

### Button

Versatile button component with multiple variants and sizes.

**Variants:**
- `default` - Primary action (indigo-600)
- `secondary` - Glass effect with hover state
- `destructive` - Red background for destructive actions
- `outline` - Border-only button
- `ghost` - Minimal button with hover effect
- `link` - Text link with underline
- `fun` - Gradient background with bounce animation (student UI)

**Sizes:** `sm`, `default`, `lg`, `icon`

**Features:**
- Loading spinner state with `isLoading` prop
- Forward ref support
- `asChild` for Slot composition

**Usage:**
```tsx
import { Button } from '@/components/ui';

// Default button
<Button>Click Me</Button>

// Loading state
<Button isLoading>Submitting...</Button>

// Fun variant (for students)
<Button variant="fun">Start Learning</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Icon className="h-5 w-5" />
</Button>
```

### Card

Glass card component for content containers with multiple variants.

**Variants:**
- `default` - Standard glass card
- `solid` - Traditional white/dark card
- `fun` - Gradient border with shimmer for student pages
- `pet` - Special animated card for pet display

**Sub-components:**
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Descriptive text
- `CardContent` - Main content area
- `CardFooter` - Footer with action buttons

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="fun">
  <CardHeader>
    <CardTitle>My Achievement</CardTitle>
  </CardHeader>
  <CardContent>
    <p>You unlocked a new level!</p>
  </CardContent>
</Card>
```

### Input & Textarea

Glass-styled form inputs with error states and optional labels.

**Features:**
- Error state with red border
- Optional label with proper association
- Glass effect styling
- Focus ring with indigo highlight
- Dark mode support

**Usage:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
/>
```

### Select

Radix UI-based select component with glass styling.

**Sub-components:**
- `SelectTrigger` - Button that opens the dropdown
- `SelectContent` - Dropdown container
- `SelectItem` - Individual option
- `SelectGroup` - Grouped options
- `SelectLabel` - Group label
- `SelectSeparator` - Divider

**Usage:**
```tsx
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select grade level" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="k">Kindergarten</SelectItem>
    <SelectItem value="1">1st Grade</SelectItem>
  </SelectContent>
</Select>
```

### Badge

Small badge component for tags, labels, and status indicators.

**Variants:**
- `default` - Indigo badge
- `secondary` - Gray badge
- `destructive` - Red badge
- `outline` - Border-only badge
- `xp` - Gold gradient for experience points
- `achievement` - Pulsing glow effect
- `level` - Level display
- `streak` - Flame effect for streaks

**Sizes:** `sm`, `default`, `lg`

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="xp">500 XP</Badge>
<Badge variant="achievement">Unlocked!</Badge>
<Badge variant="level">Level 5</Badge>
```

### Avatar

User avatar component with fallback initials.

**Sizes:** `xs` (24px), `sm` (32px), `default` (40px), `lg` (48px), `xl` (64px)

**Sub-components:**
- `AvatarImage` - Image element
- `AvatarFallback` - Text fallback

**Usage:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui';

<Avatar size="lg">
  <AvatarImage src="user.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Dialog

Modal dialog component built on Radix UI with slide-up animation.

**Sub-components:**
- `DialogTrigger` - Button that opens
- `DialogContent` - Modal content
- `DialogHeader` - Header area
- `DialogTitle` - Title text
- `DialogDescription` - Description text
- `DialogFooter` - Footer area
- `DialogClose` - Close button

**Usage:**
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### DropdownMenu

Context menu component with glass styling.

**Sub-components:**
- `DropdownMenuTrigger` - Button that opens
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Menu item
- `DropdownMenuCheckboxItem` - Checkbox item
- `DropdownMenuRadioItem` - Radio button item
- `DropdownMenuLabel` - Item label
- `DropdownMenuSeparator` - Divider

**Usage:**
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui';

<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs

Tab navigation component with animated active indicator.

**Sub-components:**
- `TabsList` - Tab list container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab content panel

**Usage:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content 1</TabsContent>
  <TabsContent value="details">Content 2</TabsContent>
</Tabs>
```

### Progress

Progress bar with multiple variants for different metrics.

**Variants:**
- `default` - Standard indigo progress
- `xp` - Gold gradient with shimmer (for experience)
- `health` - Green gradient
- `energy` - Blue gradient
- `happiness` - Pink gradient
- `knowledge` - Purple gradient

**Usage:**
```tsx
import { Progress } from '@/components/ui';

<Progress value={65} variant="xp" />
<Progress value={80} variant="health" />
```

### Toast

Toast notification system using Sonner.

**Usage:**
```tsx
import { Toast } from '@/components/ui';
import { toast } from 'sonner';

// In your layout
<Toast />

// Anywhere in app
toast.success('Achievement unlocked!');
toast.error('Something went wrong');
```

### Tooltip

Tooltip component for hover-based hints.

**Usage:**
```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Helpful text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Switch

Toggle switch component.

**Usage:**
```tsx
import { Switch } from '@/components/ui';

<Switch defaultChecked onChange={(checked) => console.log(checked)} />
```

### Checkbox

Checkbox component with indigo styling.

**Usage:**
```tsx
import { Checkbox } from '@/components/ui';

<Checkbox id="agree" />
<Label htmlFor="agree">I agree to terms</Label>
```

### Separator

Divider component with gradient effect.

**Usage:**
```tsx
import { Separator } from '@/components/ui';

<Separator />
```

### Skeleton

Animated loading skeleton with shimmer effect.

**Usage:**
```tsx
import { Skeleton } from '@/components/ui';

<Skeleton className="h-12 w-full rounded-lg" />
```

### EmptyState

Empty state display with icon, title, description, and optional action.

**Usage:**
```tsx
import { EmptyState } from '@/components/ui';

<EmptyState
  icon="📚"
  title="No courses yet"
  description="Start by creating your first course"
  action={{
    label: 'Create Course',
    onClick: () => navigate('/create'),
  }}
/>
```

### LoadingSpinner

Centered loading indicator with optional label.

**Sizes:** `sm`, `default`, `lg`

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="lg" label="Loading assignments..." />
```

### PageHeader

Page title and description with optional action slot.

**Usage:**
```tsx
import { PageHeader } from '@/components/ui';

<PageHeader
  title="My Classes"
  description="Manage your enrolled classes"
  action={<Button>Create Class</Button>}
/>
```

## Common Components

### DataTable

Reusable data table with sorting, empty states, and loading skeletons.

**Features:**
- Sortable columns
- Row hover effects
- Empty state display
- Loading skeleton
- Responsive with horizontal scroll

**Usage:**
```tsx
import { DataTable } from '@/components/common';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

<DataTable
  columns={columns}
  data={users}
  isLoading={isLoading}
  sortBy="name"
  sortDirection="asc"
  onSort={(key, direction) => handleSort(key, direction)}
  emptyState={{
    title: 'No users found',
  }}
/>
```

### SearchInput

Glass-styled search input with debounce and clear button.

**Usage:**
```tsx
import { SearchInput } from '@/components/common';

<SearchInput
  onSearch={(query) => handleSearch(query)}
  debounceMs={300}
  showShortcut
  placeholder="Search students..."
/>
```

### ConfirmDialog

Confirmation dialog for destructive or important actions.

**Usage:**
```tsx
import { ConfirmDialog } from '@/components/common';

const [openConfirm, setOpenConfirm] = useState(false);

<ConfirmDialog
  open={openConfirm}
  onOpenChange={setOpenConfirm}
  title="Delete Assignment"
  description="This action cannot be undone."
  confirmText="Delete"
  isDestructive
  onConfirm={async () => {
    await deleteAssignment(id);
  }}
/>
```

### FileUpload

Drag-and-drop file upload with validation and progress.

**Features:**
- Drag and drop support
- File size validation
- Multiple file support
- Upload progress tracking
- Image preview

**Usage:**
```tsx
import { FileUpload } from '@/components/common';

<FileUpload
  accept=".pdf,.docx"
  multiple
  maxSizeBytes={10 * 1024 * 1024}
  onFilesSelected={(files) => {
    files.forEach(file => uploadFile(file));
  }}
/>
```

### DatePicker

Simple date input with calendar icon.

**Usage:**
```tsx
import { DatePicker } from '@/components/common';

<DatePicker
  label="Due Date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
```

### RichTextEditor

Markdown-based rich text editor with preview and formatting toolbar.

**Features:**
- Bold, italic, heading, list, link formatting
- Write and preview tabs
- Markdown support
- Toolbar buttons

**Usage:**
```tsx
import { RichTextEditor } from '@/components/common';

<RichTextEditor
  label="Assignment Instructions"
  value={instructions}
  onChange={setInstructions}
/>
```

### StatCard

Dashboard statistic card with icon, value, and trend.

**Variants:** `default`, `xp`, `coins`, `achievement`, `health`

**Usage:**
```tsx
import { StatCard } from '@/components/common';

<StatCard
  label="Total XP"
  value="2,450"
  icon={<Zap className="h-6 w-6" />}
  variant="xp"
  trend={{ value: 12, isPositive: true }}
/>
```

### ColorPicker

Color picker with 12 preset colors and custom hex input.

**Usage:**
```tsx
import { ColorPicker } from '@/components/common';

<ColorPicker
  label="School Color"
  value={schoolColor}
  onChange={setSchoolColor}
/>
```

## Layout Components

### DashboardLayout

Main dashboard wrapper with sidebar, top nav, and mobile nav.

**Features:**
- Collapsible sidebar
- Sticky top navigation
- Mobile-optimized navigation
- Framer Motion transitions
- Role-based content

**Usage:**
```tsx
import { DashboardLayout } from '@/components/layouts';

<DashboardLayout
  userRole="student"
  userLevel={5}
  userXP={2500}
  userName="John Doe"
  userInitials="JD"
  userCoins={450}
  notificationCount={3}
>
  {/* Page content */}
</DashboardLayout>
```

### Sidebar

Left sidebar with navigation, level progress (students), and collapse toggle.

**Features:**
- Glass effect styling
- Navigation items per role
- XP progress bar for students
- Smooth collapse animation
- Active item indicator

**Customization:**
- Pass `NAV_ITEMS` from constants
- Modify colors in Tailwind config
- Adjust animation timing

### TopNav

Sticky top navigation with breadcrumbs, search, and user menu.

**Features:**
- Breadcrumb trail
- Global search with cmd+K shortcut
- Notifications with badge
- Theme toggle
- User dropdown menu
- XP and coins display for students

### MobileNav

Bottom navigation bar for mobile (hidden on desktop).

**Features:**
- Slides up/down on scroll
- 5 main navigation items
- Active indicator
- Hides on scroll down, shows on scroll up

### Breadcrumbs

Dynamic breadcrumb navigation with auto-generation from URL.

**Features:**
- Auto-generates from pathname
- Custom items support
- Keyboard accessible
- Glass-styled separators

## Styling Guidelines

### Glass Effect

All components use the glass morphism effect:

```css
/* Tailwind classes */
glass - Custom component (see tailwind.config.ts)
backdrop-blur-xl
bg-white/70 dark:bg-slate-800/50
border border-white/30 dark:border-slate-700/30
```

### Color System

- **Primary**: Indigo-600 (focus, active states)
- **Success**: Green gradient
- **Warning**: Amber gradient
- **Danger**: Red gradient
- **XP/Gamification**: Gold gradient
- **Achievement**: Pink/Purple gradient

### Dark Mode

All components include dark mode variants using `dark:` prefixes.

## Responsive Design

Components are mobile-first with breakpoints:

- `xs`: 320px - Mobile phones
- `sm`: 640px - Landscape mobile
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops
- `2xl`: 1536px - Large screens

## Accessibility

- Full ARIA labels and descriptions
- Keyboard navigation support
- Semantic HTML structure
- Focus management
- Color contrast compliance
- Screen reader friendly

## Animation Library

Framer Motion animations are used throughout:

- `bounce-gentle` - Subtle bounce (2s cycle)
- `slide-up` - Dialog entrance (0.5s)
- `fade-in` - Content fade (0.3s)
- `pulse-soft` - Soft pulsing (2s)
- `wiggle` - Playful wiggle (0.5s)
- `shimmer` - Loading shimmer (8s)

## Best Practices

1. **Use variant props** over inline styles
2. **Import from @/components** for clean imports
3. **Forward refs** when creating wrapper components
4. **Dark mode support** for all new components
5. **Keyboard accessibility** required
6. **Type safety** with TypeScript
7. **Props documentation** in component interfaces
8. **Test variants** in both light and dark themes

## Performance Tips

1. Use `React.memo()` for frequently re-rendered components
2. Lazy load heavy components with `React.lazy()`
3. Use `useCallback()` for event handlers
4. Avoid inline object creation in render
5. Profile with React DevTools

## File Structure

```
src/components/
├── ui/                 # Core UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts       # Export barrel
├── common/            # Reusable business components
│   ├── DataTable.tsx
│   ├── FileUpload.tsx
│   └── index.ts       # Export barrel
├── layouts/           # Page layouts
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   └── index.ts       # Export barrel
└── index.ts           # Main export barrel
```

## Future Enhancements

- [ ] Storybook setup for component documentation
- [ ] Component testing suite with Vitest
- [ ] Animation variants gallery
- [ ] Performance benchmarks
- [ ] Accessibility audit
- [ ] A11y testing integration
- [ ] Visual regression testing
