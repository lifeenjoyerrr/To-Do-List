import "../styles/globals.css";
import { TodoList } from "@/components/TodoList/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-300 py-6 flex flex-col justify-center sm:py-12">
      <TodoList />
    </main>
  );
}
