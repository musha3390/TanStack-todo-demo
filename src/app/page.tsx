// src/app/page.tsx
"use client";

import { useState } from "react";
import {
  useTodos,
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
} from "@/src/hooks/useTodos";
import TodoItem from "@/src/components/TodoItems";

export default function TodoApp() {
  const { data: todos = [], isLoading, isError, error } = useTodos();

  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo.mutate(inputValue.trim());
      setInputValue("");
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TanStack Query Todo
          </h1>
          <p className="text-gray-600">
            GraphQL + Filesystem + Optimistic Updates
          </p>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="mb-10 flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-5 py-3 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
            disabled={addTodo.isPending}
          />
          <button
            type="submit"
            disabled={addTodo.isPending || !inputValue.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-2xl transition"
          >
            {addTodo.isPending ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading todos...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No todos yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo.mutate}
                onDelete={deleteTodo.mutate}
                isPending={toggleTodo.isPending || deleteTodo.isPending}
              />
            ))
          )}
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Stale Time: 30s • GC Time: 5min • Optimistic Updates Enabled</p>
        </div>
      </div>
    </div>
  );
}
