"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { Todo } from "@/entities/todo";
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
  const [animatingId, setAnimatingId] = useState<number | null>(null);

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

  const toggleTodo = async (id: number) => {
    setAnimatingId(id);

    // Ждем завершения анимации перед обновлением состояния
    await new Promise((resolve) => setTimeout(resolve, 600));

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo
      )
    );

    setAnimatingId(null);
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

  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className="w-full max-w-[1200px] h-[800px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl flex flex-col gap-6 overflow-hidden">
      <h1 className="text-3xl font-bold text-black">Todo List</h1>
      <div className="flex mb-4">
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
      <div className="flex gap-8 h-full overflow-y-auto">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-300 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">Incomplete</h2>
          <AnimatePresence>
            <ul className="space-y-2">
              {incompleteTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: animatingId === todo.id ? 0 : 1,
                    y: animatingId === todo.id ? -50 : 0,
                    scale: animatingId === todo.id ? 0.8 : 1,
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
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
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300">
                      <motion.div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer mr-3 ${
                          animatingId === todo.id
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                        whileTap={{ scale: 0.9 }}
                      >
                        {animatingId === todo.id && (
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
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-300 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">Completed</h2>
          <AnimatePresence>
            <ul className="space-y-2">
              {completedTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full text-black"
                >
                  <motion.div
                    className="flex items-center bg-white p-3 rounded-lg border border-gray-300"
                    layout
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center mr-3"
                      onClick={() => toggleTodo(todo.id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                    <span className="flex-grow line-through">{todo.text}</span>
                    <Button
                      onClick={() => deleteTodo(todo.id)}
                      variant="danger"
                      className="p-2"
                    >
                      <X size={18} />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
