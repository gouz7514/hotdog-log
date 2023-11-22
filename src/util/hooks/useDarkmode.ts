import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { theme } from '@/store/theme'

type Theme = 'light' | 'dark'

export const useDarkMode = (): [string, () => void] => {
  const [currentTheme, setCurrentTheme] = useRecoilState(theme)

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') as Theme | null
    
    if (localTheme) {
      setCurrentTheme({
        value: localTheme
      })
      document.body.dataset.theme = localTheme
    } else {
      setCurrentTheme({
        value: 'light'
      })
      document.body.dataset.theme = 'light'
    }
  }, [setCurrentTheme])

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    window.localStorage.setItem('theme', newTheme)
    document.body.dataset.theme = newTheme
    setCurrentTheme({
      value: newTheme
    })
  }

  return [currentTheme.value, toggleTheme]
}
