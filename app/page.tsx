'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { VoiceNotes } from '@/components/voice-notes';
import { Conversation } from '@/components/conversation';
import { Copy as CopyIcon, Share as ShareIcon, Trash as TrashIcon } from 'lucide-react'
import { SessionHistory } from '@/components/session-history';


export default function Page() {
  const [time, setTime] = useState(60 * 60); // 60 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [dailyGoal, setDailyGoal] = useState(180);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  const handleGoalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingGoal(false);
    // Here you could add API call to save the goal
  };



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
  
  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      toast.success('Time is up! 🎉');
    }
  }, [time]);
  
  // Add this useEffect to update completed minutes when a session ends
  useEffect(() => {
    if (time === 0 && isRunning) {
      // Calculate the actual session duration that was completed
      const sessionDuration = Math.floor(time / 60); // Convert seconds to minutes
      setCompletedMinutes(prev => prev + sessionDuration);
      setIsRunning(false);
      toast.success('Time is up! 🎉');
    }
  }, [time, isRunning]);

  useEffect(() => {
    if (time === 0 && isRunning) {
      setCompletedMinutes(prev => prev + sessionDuration);
      setIsRunning(false);
      toast.success('Time is up! 🎉');
    }
  }, [time, isRunning, sessionDuration]);

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
      setSessionDuration(time / 60); // Store the session duration in minutes
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
            <div 
              className="text-7xl font-bold tracking-tighter"
            >
              {formatTime(time)}
            </div>

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

        {/* Widget for interacting with ElevenLabs Convai  */} 
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-semibold">Talk to Agent</h2>
          <Conversation />
        </Card>

        {/* Voice Notes section will go here */} 
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-semibold">Voice Notes</h2>
          <VoiceNotes />
        </Card>

      
        {/* Progress tracking will go here */}
        
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
  {/* Update the Progress section with a two-color progress bar */}
  <div>
  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
  <p className="text-2xl font-bold">{completedMinutes}/{dailyGoal} minutes</p>
  <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
    <div 
      className="h-2 rounded-full bg-blue-600"
      style={{ 
        width: `${(completedMinutes / dailyGoal) * 100}%`,
        transition: 'width 0.3s ease-in-out'
      }}
    />
  </div>
</div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Session Focus History</h3>
              <SessionHistory />
            </div>
          </div>
        </Card>
      
        {/* Spotify embed will go here <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/26fAdaxFASXkMyZMl71bGl?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */}
        
      </div>
    </div>
  );
}