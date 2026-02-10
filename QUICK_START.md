# Wolf Whale LMS - Quick Start Guide

## 🚀 Fast Track to Using Components

### Import Patterns

```typescript
// Barrel imports (recommended)
import { Button, Card, Input } from '@/components/ui';
import { DataTable, FileUpload } from '@/components/common';
import { DashboardLayout } from '@/components/layouts';

// Individual imports
import { Button } from '@/components/ui/Button';
```

## 📦 Most Used Components

### Button
```typescript
<Button>Default</Button>
<Button variant="fun">Student Button</Button>
<Button isLoading>Loading...</Button>
<Button variant="destructive">Delete</Button>
```

### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input & Select
```typescript
<Input label="Email" type="email" />
<Textarea label="Description" />
<Select>
  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Badge
```typescript
<Badge variant="xp">500 XP</Badge>
<Badge variant="achievement">Unlocked</Badge>
<Badge variant="level">Level 5</Badge>
```

## 🎯 Layout Setup

```typescript
// In your page
import { DashboardLayout } from '@/components/layouts';

export default function StudentDashboard() {
  return (
    <DashboardLayout
      userRole="student"
      userLevel={5}
      userName="John Doe"
      userCoins={450}
    >
      <PageHeader title="Dashboard" />
      {/* Content */}
    </DashboardLayout>
  );
}
```

## 📊 Data Display

### DataTable
```typescript
import { DataTable } from '@/components/common';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
];

<DataTable columns={columns} data={assignments} />
```

### StatCard
```typescript
import { StatCard } from '@/components/common';

<StatCard
  label="Total XP"
  value="2,450"
  variant="xp"
  trend={{ value: 12, isPositive: true }}
/>
```

## 🎨 Styling Cheat Sheet

### Glass Effect
```css
/* Already built-in to components */
glass - backdrop-blur + transparency
dark:bg-slate-800/50 - Dark mode

/* Use on custom elements */
<div className="glass backdrop-blur-lg bg-white/70 rounded-xl">
  Content
</div>
```

### Colors
```css
text-indigo-600     /* Primary */
bg-success-500      /* Success */
bg-danger-600       /* Destructive */
bg-gold-500         /* XP/Rewards */
bg-gradient-to-r from-indigo-500 to-purple-600  /* Fun */
```

### Sizes
```css
h-8 w-8    /* Icon buttons */
h-10       /* Regular input height */
px-4 py-2  /* Standard padding */
rounded-xl /* Slightly rounded */
rounded-3xl /* Very rounded (fun) */
```

## 🎬 Common Animations

```css
animate-bounce-gentle     /* Playful hover */
animate-slide-up          /* Dialog entrance */
animate-fade-in           /* Content appear */
animate-shimmer           /* Loading */
```

## 🔧 Dark Mode

Components auto-support dark mode via `next-themes`:

```typescript
// In layout.tsx
import { ThemeProvider } from '@/components/providers';

<ThemeProvider>
  {children}
</ThemeProvider>

// Toggle theme
const { theme, setTheme } = useTheme();
setTheme(theme === 'dark' ? 'light' : 'dark');
```

## 📱 Responsive Classes

```css
sm:hidden    /* Hidden on mobile */
md:flex      /* Show on tablet+ */
lg:grid      /* Grid on laptop+ */
hidden md:block /* Mobile hidden, tablet+ visible */
```

## ✨ Typography

```typescript
<h1 className="text-3xl font-bold">Heading 1</h1>
<h2 className="text-2xl font-semibold">Heading 2</h2>
<p className="text-sm text-slate-600">Secondary text</p>
```

## 🎯 Form Patterns

```typescript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    error={errors.email}
  />
  <Button type="submit">Submit</Button>
</form>
```

## 🔔 Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Achievement unlocked!');

// Error
toast.error('Something went wrong');

// Loading
const id = toast.loading('Processing...');
toast.success('Done!', { id });
```

## 📋 Dialog Pattern

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## 🔐 Type Safety

All components are fully typed:

```typescript
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'fun';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
}

// TypeScript will warn you of invalid props
<Button variant="invalid" /> // ❌ Error
<Button variant="fun" />     // ✅ OK
```

## 🚦 Component Props Reference

### Button
- `variant`: Button style
- `size`: Button size
- `isLoading`: Show spinner
- `disabled`: Disable button
- `onClick`: Click handler
- `children`: Button text

### Input
- `label`: Input label
- `type`: Input type (text, email, etc)
- `error`: Error message
- `value`: Current value
- `onChange`: Change handler
- `placeholder`: Placeholder text

### Card
- `variant`: Card style (default, solid, fun, pet)
- `children`: Card content

### Badge
- `variant`: Badge style
- `size`: Badge size (sm, default, lg)
- `children`: Badge text

## 📚 Documentation

- **Full Guide**: `COMPONENT_GUIDE.md` (5,000+ words)
- **Implementation**: `IMPLEMENTATION_COMPLETE.md`
- **System Summary**: `UI_SYSTEM_SUMMARY.md`

## 🐛 Common Issues

### Component not showing
- Check import path
- Verify variant name
- Check for className conflicts
- Look at console for errors

### Dark mode not working
- Ensure `next-themes` is in layout
- Check `ThemeProvider` is wrapping app
- Verify `dark:` classes are in component

### Animation not smooth
- Check Framer Motion is installed
- Verify tailwind animations in config
- Look for conflicting CSS

### Responsive not working
- Use mobile-first (sm:, md:, lg:)
- Check breakpoints in tailwind.config
- Test with browser DevTools

## 🔗 Useful Links

- **Radix UI**: https://radix-ui.com/docs/primitives/overview/introduction
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Class Variance Authority**: https://cva.style/docs
- **Lucide Icons**: https://lucide.dev/

## ⚡ Performance Tips

1. Use barrel imports (faster tree-shaking)
2. Lazy load heavy components
3. Memoize callback functions
4. Avoid inline object creation
5. Use Virtual scrolling for large lists

## 🎓 Learning Path

1. Start with `Button` and `Card`
2. Learn `Input` and form components
3. Move to `DataTable`
4. Build with `DashboardLayout`
5. Add animations with props
6. Integrate with state management

## ✅ Pre-launch Checklist

- [ ] All components imported correctly
- [ ] Dark mode tested
- [ ] Mobile responsive verified
- [ ] Accessibility checked
- [ ] Performance tested
- [ ] Console errors cleared
- [ ] Data connected
- [ ] Forms working
- [ ] Notifications set up
- [ ] Ready to ship!

## 🆘 Need Help?

1. Check `COMPONENT_GUIDE.md` for detailed docs
2. Review component source code
3. Check props interface TypeScript definitions
4. Test in browser DevTools
5. Look for similar examples in codebase

---

**Status**: ✅ Production Ready
**Last Updated**: February 2026
**Version**: 1.0.0
