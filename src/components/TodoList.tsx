import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import TodoItem from './TodoItem';
import { showSuccess, showError } from '@/utils/toast';
import { Mic, Link, ListFilter, Search } from "lucide-react"; // Removed Paperclip
import { format } from 'date-fns';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

type SortOrder = 'none' | 'alphabet-asc' | 'alphabet-desc' | 'dueDate-asc' | 'dueDate-desc';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodoText, setNewTodoText] = useState<string>('');
  // Removed isFileDialogOpen state
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Removed fileInputRef

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTodo = () => {
    if (newTodoText.trim() === '') {
      showError("To-do text cannot be empty!");
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      dueDate: undefined,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    showSuccess("To-do added successfully!");
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    showSuccess("To-do status updated!");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showSuccess("To-do deleted!");
  };

  const updateTodoDueDate = (id: string, date: string | undefined) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, dueDate: date } : todo
      )
    );
    showSuccess(date ? "Due date set!" : "Due date cleared!");
  };

  // Removed handleFileSelect

  const handleOpenLink = () => {
    if (linkUrl.trim() === '') {
      showError("Please enter a URL.");
      return;
    }
    try {
      let url = linkUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      window.open(url, '_blank');
      showSuccess("Opening link in new tab!");
      setLinkUrl('');
      setIsLinkDialogOpen(false);
    } catch (error) {
      showError("Invalid URL provided.");
      console.error("Failed to open link:", error);
    }
  };

  const filteredAndSortedTodos = useMemo(() => {
    let currentTodos = [...todos];

    if (searchTerm) {
      currentTodos = currentTodos.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOrder) {
      case 'alphabet-asc':
        currentTodos.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'alphabet-desc':
        currentTodos.sort((a, b) => b.text.localeCompare(a.text));
        break;
      case 'dueDate-asc':
        currentTodos.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'dueDate-desc':
        currentTodos.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        break;
      case 'none':
      default:
        currentTodos.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }
    return currentTodos;
  }, [todos, searchTerm, sortOrder]);


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl text-center">My To-Do List</CardTitle>
        <p className="text-sm text-center text-muted-foreground mt-1">
          {format(currentTime, "EEEE, MMM dd, yyyy HH:mm:ss")}
        </p>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4"
          />
        </div>

        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new to-do..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addTodo();
              }
            }}
            className="flex-grow"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {/* Removed Attach File Button */}
            <Button variant="outline" size="sm" onClick={() => setIsAudioDialogOpen(true)}>
              <Mic className="h-4 w-4 mr-1" /> Audio Note
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsLinkDialogOpen(true)}>
              <Link className="h-4 w-4 mr-1" /> Link Web
            </Button>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <ListFilter className="h-4 w-4 mr-1" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('none')}>
                Default Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder('alphabet-asc')}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('alphabet-desc')}>
                Alphabetical (Z-A)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder('dueDate-asc')}>
                Due Date (Earliest First)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('dueDate-desc')}>
                Due Date (Latest First)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          {filteredAndSortedTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks found.</p>
          ) : (
            filteredAndSortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={toggleComplete}
                onDelete={deleteTodo}
                onUpdateDueDate={updateTodoDueDate}
              />
            ))
          )}
        </div>
      </CardContent>

      {/* Removed Hidden file input */}

      {/* Audio Note Dialog */}
      <Dialog open={isAudioDialogOpen} onOpenChange={setIsAudioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Audio Note</DialogTitle>
            <DialogDescription>
              This is where the audio recording interface would appear.
              (Functionality not implemented in this version)
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Click "Close" to dismiss this dialog.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAudioDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Web Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Web Link</DialogTitle>
            <DialogDescription>
              Enter the URL you want to open.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleOpenLink();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleOpenLink}>Open Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TodoList;