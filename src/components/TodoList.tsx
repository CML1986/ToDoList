import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import TodoItem from './TodoItem';
import { showSuccess, showError } from '@/utils/toast';
import { Paperclip, Mic, Link } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim() === '') {
      showError("To-do text cannot be empty!");
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      showSuccess(`Selected file: ${files[0].name}`);
      console.log("Selected file:", files[0]);
    }
    setIsFileDialogOpen(false); // Close dialog after selection
  };

  const handleOpenLink = () => {
    if (linkUrl.trim() === '') {
      showError("Please enter a URL.");
      return;
    }
    try {
      // Basic URL validation and ensuring protocol
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl text-center">My To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
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

        <div className="flex justify-center space-x-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => {
            setIsFileDialogOpen(true);
            // Programmatically click the hidden file input
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}>
            <Paperclip className="h-4 w-4 mr-1" /> Attach File
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAudioDialogOpen(true)}>
            <Mic className="h-4 w-4 mr-1" /> Audio Note
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsLinkDialogOpen(true)}>
            <Link className="h-4 w-4 mr-1" /> Link Web
          </Button>
        </div>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks yet! Add one above.</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={toggleComplete}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </CardContent>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple={false} // Or true if you want multiple files
        accept="*/*" // Allows all file types
      />

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