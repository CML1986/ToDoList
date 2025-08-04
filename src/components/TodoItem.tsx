import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
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
      <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default TodoItem;