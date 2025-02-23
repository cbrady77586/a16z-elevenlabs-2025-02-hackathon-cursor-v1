import { Button } from '@/components/ui/button';
import { Clipboard, Send, Trash as TrashIcon } from 'lucide-react';

export function SessionHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select className="w-full rounded-md border p-2">
        <option>Please select</option>
        <option>Copy to Clipboard</option>
        <option>Semd to Notion</option>
        <option>Delete</option>
        </select>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="w-8 pb-2"><input type="checkbox" /></th>
            <th className="pb-2">Time</th>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" /></td>
            <td className="py-2">9:00 AM</td>
            <td>Complete API documentation</td>
            <td className="text-right">
              <Button variant="ghost" size="icon"><Clipboard className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><TrashIcon className="h-4 w-4" /></Button>
            </td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td className="py-2">10:00 AM</td>
            <td>Debug authentication flow</td>
            <td className="text-right">
              <Button variant="ghost" size="icon"><Clipboard className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><TrashIcon className="h-4 w-4" /></Button>
            </td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td className="py-2">11:00 AM</td>
            <td>Review pull requests</td>
            <td className="text-right">
              <Button variant="ghost" size="icon"><Clipboard className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><TrashIcon className="h-4 w-4" /></Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}