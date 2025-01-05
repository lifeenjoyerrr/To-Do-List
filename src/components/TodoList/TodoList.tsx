"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { Todo } from "@/entities/todo";
import { TodoItem } from "./TodoItem/TodoItem";
import { Button } from "@/shared/ui/Button/button";
import { Input } from "@/shared/ui/Input/input";
import { Pencil, X } from "lucide-react";
import { PlusCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          updatedAt: Date.now(),
        },
      ]);
      setNewTodo("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      finishEditing(id, e.currentTarget.value);
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo
      )
    );
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  };

  return (
    <div className="w-[800px] h-[600px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl overflow-y-auto custom-scrollbar">
      <h1 className="text-2xl font-bold mb-4 text-black">Todo List</h1>
      <div className="flex mb-4 w-full">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow text-black mr-2"
          placeholder="Add a new todo"
        />
        <Button onClick={addTodo}>
          <PlusCircle size={24} />
        </Button>
      </div>
      <AnimatePresence mode="popLayout">
        <ul className="space-y-2 w-full">
          {todos
            .sort((a, b) => a.updatedAt - b.updatedAt)
            .map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                layout
                className="w-full text-black"
              >
                {editingId === todo.id ? (
                  <Input
                    defaultValue={todo.text}
                    onBlur={(e) => finishEditing(todo.id, e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                    autoFocus
                    className="w-full mb-2 text-black"
                  />
                ) : (
                  <div className="flex items-center w-full bg-gray-50 p-3 rounded-lg">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer mr-3 ${
                        todo.completed
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTodo(todo.id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      {todo.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check size={16} className="text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    <span className="flex-grow">{todo.text}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(todo.id)}
                        variant="secondary"
                        className="p-2"
                      >
                        <Pencil size={18} className="text-blue-500" />
                      </Button>
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        variant="danger"
                        className="p-2"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};
