'use client';

import { useConversation } from '@11labs/react';
import { useCallback } from 'react';
import { Mic, Square } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react';
import { Clipboard, Send, Trash } from 'lucide-react';
import { toast } from 'sonner';

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

      <div className="w-full max-w-2xl mt-4">
        {/*<h3 className="text-lg font-semibold mb-2">Conversation History</h3>*/}
        {transcripts.length > 0 && (<div className="border rounded-lg overflow-hidden">
          <div className="divide-y">
            {Object.entries(
              transcripts.reduce((acc, entry) => {
                const conversationId = entry.time;
                if (!acc[conversationId]) {
                  acc[conversationId] = [];
                }
                acc[conversationId].push(entry);
                return acc;
              }, {} as Record<string, TranscriptEntry[]>)
            ).map(([time, entries]) => (

                <div key={time} className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    Conversation started at {time}
                  </div>
                  <div>
                    {entries.map((entry, i) => (
                      <div key={i} className="mb-2">
                        <span className="font-semibold">
                          {entry.isAgent ? 'Agent: ' : 'You: '}
                        </span>
                        <span>{entry.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const text = entries
                          .map(e => `${e.isAgent ? 'Agent' : 'You'}: ${e.text}`)
                          .join('\n');
                        navigator.clipboard.writeText(text);
                        toast("Conversation copied to clipboard");
                      }}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        const webhookUrl = process.env.NEXT_PUBLIC_N8N_VOICENOTES_WEBHOOK_URL;
                        if (!webhookUrl) {
                          toast.error("Webhook URL not configured");
                          return;
                        }
                        try {
                          const response = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              time,
                              conversation: entries,
                            }),
                          });
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                          toast.success("Conversation sent successfully");
                        } catch (error) {
                          console.error('Webhook error:', error);
                          toast.error(`Failed to send conversation: ${error.message}`);
                        }
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTranscripts(prev => 
                          prev.filter(t => t.time !== time)
                        );
                        toast("Conversation deleted");
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );