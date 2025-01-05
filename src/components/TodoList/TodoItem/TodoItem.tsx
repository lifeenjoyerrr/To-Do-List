import { Todo } from "../../../../../entities/todo";
import { Button } from "@/shared/ui/Button/button";
import { CheckCircle, Circle, Pencil, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isEditing: boolean;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
}: TodoItemProps) => {
  return (
    <li className="flex items-center justify-between w-full">
      <span
        className={`flex-grow ${
          todo.completed ? "line-through text-gray-500" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(todo.id)}
          variant="secondary"
          className="p-2"
        >
          <Pencil size={18} className="text-blue-500" />
        </Button>
        <Button
          onClick={() => onDelete(todo.id)}
          variant="danger"
          className="p-2"
        >
          <X size={18} />
        </Button>
      </div>
    </li>
  );
};
