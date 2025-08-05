import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import DatePicker from './DatePicker';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: string;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, date: string | undefined) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onUpdateDueDate }) => {
  const handleDateChange = (date: Date | undefined) => {
    onUpdateDueDate(todo.id, date ? date.toISOString() : undefined);
  };

  // Determine if dueDate has a time component (e.g., not just YYYY-MM-DD)
  const hasTime = todo.dueDate && (new Date(todo.dueDate).getHours() !== 0 || new Date(todo.dueDate).getMinutes() !== 0 || new Date(todo.dueDate).getSeconds() !== 0);
  const dateFormat = hasTime ? "MMM dd, yyyy p" : "MMM dd, yyyy"; // p for time (e.g., 10:30 AM)

  // Truncate text if longer than 12 characters
  const truncatedText = todo.text.length > 12 ? `${todo.text.substring(0, 12)}...` : todo.text;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 gap-2">
      <div className="flex items-center gap-3 flex-grow min-w-0"> {/* min-w-0 allows flex item to shrink */}
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col overflow-hidden"> {/* Added overflow-hidden for truncate */}
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  todo.completed ? "line-through text-muted-foreground" : "",
                  "truncate" // Tailwind's truncate class for ellipsis
                )}
              >
                {truncatedText}
              </label>
              {todo.dueDate && (
                <span className="text-xs text-muted-foreground mt-0.5">
                  <CalendarIcon className="inline-block h-3 w-3 mr-1 -mt-0.5" />
                  {format(new Date(todo.dueDate), dateFormat)}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{todo.text}</p> {/* Full text displayed on hover */}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <DatePicker
          date={todo.dueDate ? new Date(todo.dueDate) : undefined}
          onDateChange={handleDateChange}
          placeholder="Set Due Date"
          className="w-[150px] h-8 text-xs"
        />
        <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;