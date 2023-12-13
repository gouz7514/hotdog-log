import { createContext } from 'react'
import { theme, MainTheme } from '@/styles/theme'

interface ContextProps {
  colorTheme: MainTheme | null
  toggleTheme: () => void
}

const ThemeContext = createContext<ContextProps>({
  colorTheme: theme.light,
  toggleTheme: () => {},
})

export default ThemeContext
