import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/Input';

const PRESET_COLORS = [
  '#6366f1', // indigo-600
  '#3b82f6', // blue-500
  '#0284c7', // sky-600
  '#0891b2', // cyan-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#dc2626', // red-600
  '#e11d48', // rose-600
  '#9333ea', // purple-600
  '#7c3aed', // violet-600
  '#0ea5e9', // sky-500
  '#14b8a6', // teal-600
];

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [customColor, setCustomColor] = React.useState(value || '#6366f1');

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    onChange?.(color);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange?.(color);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handlePresetClick(color)}
            className={cn(
              'aspect-square rounded-lg transition-all duration-200 ring-offset-2',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              customColor === color && 'ring-2 ring-indigo-500 scale-110'
            )}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="custom-color" className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Custom Color
        </label>
        <div className="flex gap-2">
          <div
            className="h-10 w-10 rounded-xl border-2 border-white/30 dark:border-slate-600/30"
            style={{ backgroundColor: customColor }}
          />
          <Input
            id="custom-color"
            type="text"
            value={customColor}
            onChange={handleCustomChange}
            placeholder="#6366f1"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
