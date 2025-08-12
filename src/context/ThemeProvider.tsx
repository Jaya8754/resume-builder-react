import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | null;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem("theme") as Theme || null);

  // Detect system preference and listen for changes
  useEffect(() => {
    if(!theme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemPref = mediaQuery.matches ? "dark" : "light";
      setTheme(systemPref);

      const listener = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
      };

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);