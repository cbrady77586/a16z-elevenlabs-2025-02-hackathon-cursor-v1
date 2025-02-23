import { Button } from '@/components/ui/button';
import { Clipboard, Send, Trash } from 'lucide-react';

type Session = {
  time: string;
  description: string;
  duration: number;
};

interface SessionHistoryProps {
  sessions: Session[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  if (!sessions) return null;
  
  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="w-8 pb-2"><input type="checkbox" /></th>
            <th className="pb-2">Time</th>
            <th className="pb-2">Duration</th>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td className="py-2">{session.time}</td>
              <td className="py-2">{session.duration} min</td>
              <td>{session.description}</td>
              <td className="text-right">
                <Button variant="ghost" size="icon"><Clipboard className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Trash className="h-4 w-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}