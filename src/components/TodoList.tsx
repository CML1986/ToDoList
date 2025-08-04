import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TodoItem from './TodoItem';
import { showSuccess, showError } from '@/utils/toast';

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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl text-center">My To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
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
    </Card>
  );
};

export default TodoList;