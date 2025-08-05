import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import DatePicker from './DatePicker';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: string; // Added dueDate
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, date: string | undefined) => void; // New prop for updating due date
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onUpdateDueDate }) => {
  const handleDateChange = (date: Date | undefined) => {
    onUpdateDueDate(todo.id, date ? date.toISOString() : undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 gap-2">
      <div className="flex items-center gap-3 flex-grow">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            todo.completed ? "line-through text-muted-foreground" : ""
          )}
        >
          {todo.text}
        </label>
      </div>
      <div className="flex items-center gap-2">
        {todo.dueDate && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {format(new Date(todo.dueDate), "MMM dd, yyyy")}
          </span>
        )}
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