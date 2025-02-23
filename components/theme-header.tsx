 'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeHeader() {
  const { setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">FocusFlow</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTheme('calming')}
          >
            Calming
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTheme('energizing')}
          >
            Energizing
          </Button>
          <Button variant="ghost" size="sm">Sign Out</Button>
        </div>
      </div>
    </header>
  );
}