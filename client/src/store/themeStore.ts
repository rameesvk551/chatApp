import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const storedTheme =
    typeof window !== "undefined" ? localStorage.getItem("chat-theme") : null;

  return {
    theme: storedTheme || "coffee",
    setTheme: (theme: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("chat-theme", theme);
      }
      set({ theme });
    },
  };
});
``
