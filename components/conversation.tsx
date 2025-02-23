'use client';

import { useConversation } from '@11labs/react';
import { useCallback } from 'react';
import { Mic, Square } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react';

interface TranscriptEntry {
  time: string;
  text: string;
  isAgent: boolean;
}



export function Conversation() {
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  
    const conversation = useConversation({
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
        onMessage: (message) => {
          console.log('Message received:', message);
          
          if (message.source === 'ai' || message.source === 'user') {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit'
            });
            
            setTranscripts(prev => [...prev, {
              time,
              text: message.message, // Use message.message instead of message.text
              isAgent: message.source === 'ai'
            }]);
          }
        },
        onError: (error) => console.error('Error:', error),
      });


  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          variant="default"
        >
          <Mic className="mr-2 h-4 w-4" />
          Start Conversation
        </Button>
        <Button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          variant="destructive"
        >
          <Square className="mr-2 h-4 w-4" />
          Stop Conversation
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>

      {/* Add transcript display */}
      <div className="w-full max-w-2xl mt-4">
        <h3 className="text-lg font-semibold mb-2">Conversation History</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Speaker</th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{entry.time}</td>
                  <td className="px-4 py-2">{entry.text}</td>
                  <td className="px-4 py-2">{entry.isAgent ? 'Agent' : 'You'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}