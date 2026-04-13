"use client";

import { Todo } from "@/src/hooks/useTodos";
import { Trash2, Check } from "lucide-react";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isPending?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  isPending,
}: Props) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all">
      <button
        onClick={() => onToggle(todo.id)}
        disabled={isPending}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${
            todo.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <span
        className={`flex-1 text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        disabled={isPending}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}