import { ScriptOnce } from "@tanstack/react-router"
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"

const validThemes = ["dark", "light", "system"] as const

type Theme = (typeof validThemes)[number]

function isTheme(value: string | null): value is Theme {
  return value !== null && (validThemes as readonly string[]).includes(value)
}

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: "system",
  setTheme: () => {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme"
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }
    const stored = localStorage.getItem(storageKey)
    return isTheme(stored) ? stored : defaultTheme
  })

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      if (newTheme === "system") {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, newTheme)
      }
    },
    [storageKey]
  )

  useEffect(() => {
    const apply = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          matchMedia("(prefers-color-scheme: dark)").matches)

      document.documentElement.classList.toggle("dark", isDark)
      document.documentElement.style.colorScheme = isDark ? "dark" : "light"
    }

    apply()

    if (theme === "system") {
      const media = matchMedia("(prefers-color-scheme: dark)")
      media.addEventListener("change", apply)
      return () => media.removeEventListener("change", apply)
    }
    return undefined
  }, [theme])

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <ThemeContext value={contextValue}>
      <ScriptOnce>
        {`(() => {
          const stored = localStorage.getItem('${storageKey}');
          const theme = stored || '${defaultTheme}';
          const isDark = theme === 'dark' ||
            (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.classList.toggle('dark', isDark);
          document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        })()`}
      </ScriptOnce>
      {children}
    </ThemeContext>
  )
}

export const useTheme = () => use(ThemeContext)
