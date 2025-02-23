 'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface VoiceNote {
  timestamp: string;
  text: string;
  sent: boolean;
  id: string;
}

export function VoiceNotes() {
    const [notes, setNotes] = useState<VoiceNote[]>([]);
  
    return (
      <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Voice Notes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Notes synced to Notion')}>
            Sync to Notion
          </Button>
        </div>
      </div>

      {/* ElevenLabs Convai Widget */}
      <elevenlabs-convai agent-id="l0kdP0eat20RZqZn1OMR"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell>
                <Checkbox checked={note.sent} />
              </TableCell>
              <TableCell>{note.timestamp}</TableCell>
              <TableCell>{note.text}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Handle delete
                    toast.success('Note deleted');
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}