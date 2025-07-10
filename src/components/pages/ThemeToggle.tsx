import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext"; // adjust path

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toggle aria-label="Toggle dark mode" pressed={isDark} onPressedChange={toggleTheme}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Toggle>
  );
}

export default ThemeToggle;
