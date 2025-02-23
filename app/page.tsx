'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { VoiceNotes } from '@/components/voice-notes';
import { Conversation } from '@/components/conversation';
import { Copy as CopyIcon, Share as ShareIcon, Trash as TrashIcon } from 'lucide-react';
import { SessionHistory } from '@/components/session-history';

type Session = {
  time: string;
  description: string;
  duration: number;
};

export default function Page() {
  const [time, setTime] = useState(60 * 60); // 60 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [dailyGoal, setDailyGoal] = useState(180);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<Array<{
    time: string;
    description: string;
    duration: number;
  }>>([]);

  const handleGoalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingGoal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const adjustTime = (minutes: number) => {
    setTime(prev => Math.max(0, prev + (minutes * 60)));
  };

  const toggleTimer = () => {
    if (!isRunning && mode === 'focus' && !focusText) {
      toast.error('Please enter a focus goal');
      return;
    }
    
    setIsRunning(!isRunning);
    if (!isRunning) {
      setSessionDuration(Math.ceil(time / 60));
      if (mode === 'focus') {
        toast.success('Focus time started ⏲️');
      } else {
        setFocusText('Break');
        toast.success('Break time started ⏲️');
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, time]);

  // Timer completion effect
  useEffect(() => {
    if (time === 0 && isRunning) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setSessionHistory(prev => [...prev, {
        time: currentTime,
        description: focusText,
        duration: sessionDuration
      }]);
      
      if (mode === 'focus') {
        setCompletedMinutes(prev => prev + sessionDuration);
      }
      setIsRunning(false);
      setTime(60 * 60);
      setFocusText('');
      toast.success('Time is up! 🎉');
    }
  }, [time, isRunning, sessionDuration, focusText, mode]);

  // The ONLY endSessionEarly function
  const endSessionEarly = () => {
    const completedMinutes = Math.ceil((sessionDuration * 60 - time) / 60);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (completedMinutes > 0) {
      setSessionHistory(prev => [...prev, {
        time: currentTime,
        description: focusText,
        duration: completedMinutes
      }]);
      
      if (mode === 'focus') {
        setCompletedMinutes(prev => prev + completedMinutes);
      }
    }
    
    setIsRunning(false);
    setTime(60 * 60);
    setFocusText('');
    toast.success('Session ended early');
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
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold mb-8">
              {formatTime(time)}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">For Demo Purposes</p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTime(30)}
                  disabled={isRunning}
                >
                  30s
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTime(60)}
                  disabled={isRunning}
                >
                  1m
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
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
          </div>

          <div className="mt-6 flex justify-center gap-2">
            <Button 
              size="lg"
              onClick={toggleTimer}
              className="min-w-[200px]"
            >
              {isRunning ? 'Pause Session' : 'Start Session'}
            </Button>
            {isRunning && (
              <Button 
                size="lg"
                variant="destructive"
                onClick={endSessionEarly}
                className="min-w-[200px]"
              >
                End Early
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="mb-4 text-lg font-semibold">Talk to Agent</h2>
          <Conversation />
        </Card>

        <Card className="p-8">
          <h2 className="mb-4 text-lg font-semibold">Voice Notes</h2>
          <VoiceNotes />
        </Card>

        <Card className="p-8">
          <h2 className="mb-4 text-lg font-semibold">Today's Progress</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Daily Goal</h3>
              {isEditingGoal ? (
                <form onSubmit={handleGoalSave} className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                    className="w-24 text-2xl font-bold"
                    autoFocus
                  />
                  <span className="text-2xl font-bold">focused minutes</span>
                  <Button type="submit" size="sm">Save</Button>
                </form>
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer" 
                  onClick={() => setIsEditingGoal(true)}
                >
                  <p className="text-2xl font-bold">{dailyGoal} focused minutes</p>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <p className="text-2xl font-bold">{completedMinutes}/{dailyGoal} minutes</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div 
                  className="h-2 rounded-full bg-blue-600"
                  style={{ 
                    width: `${(completedMinutes / dailyGoal) * 100}%`,
                    opacity: completedMinutes > 0 ? 1 : 0,
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Session Focus History</h3>
              <SessionHistory sessions={sessionHistory} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}