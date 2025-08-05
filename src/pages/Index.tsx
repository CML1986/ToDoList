import { MadeWithDyad } from "@/components/made-with-dyad";
import TodoList from "@/components/TodoList";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4"> {/* Position the theme toggle */}
        <ThemeToggle />
      </div>
      <TodoList />
      <MadeWithDyad />
    </div>
  );
};

export default Index;