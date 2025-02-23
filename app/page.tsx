'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { VoiceNotes } from '@/components/voice-notes';
import { Conversation } from '@/components/conversation';




export default function Page() {
  const [time, setTime] = useState(60 * 60); // 60 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const adjustTime = (minutes: number) => {
    setTime(prev => Math.max(0, prev + (minutes * 60)));
  };

  const toggleTimer = () => {
    if (!isRunning && !focusText) {
      toast.error('Please enter a focus goal');
      return;
    }
    
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success('Focus time started ⏲️');
    }
  };


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Input
          placeholder="What's your focus for this session?"
          value={focusText}
          onChange={(e) => setFocusText(e.target.value)}
          className="text-center text-lg"
        />

        <Card className="p-8">
          <div className="text-center">
            <motion.div 
              className="text-7xl font-bold tracking-tighter"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
            >
              {formatTime(time)}
            </motion.div>

            <div className="mt-8 flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => adjustTime(-5)}
                disabled={isRunning}
              >
                -5m
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-w-[100px]"
                onClick={() => setMode(mode === 'focus' ? 'break' : 'focus')}
              >
                {mode === 'focus' ? 'Focus' : 'Break'}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => adjustTime(5)}
                disabled={isRunning}
              >
                +5m
              </Button>
            </div>

            <Button 
              size="lg"
              onClick={toggleTimer}
              className="mt-6 min-w-[200px]"
            >
              {isRunning ? 'Pause Session' : 'Start Session'}
            </Button>
          </div>
        </Card>

        {/* Voice Notes section will go here */}
<Conversation />

        
        {/* Progress tracking will go here */}
        {/* Spotify embed will go here */}
      </div>
    </div>
  );
}