import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { theme } from '@/store/theme'

import { Theme } from '@/types/types'

export const useDarkMode = (): [string, () => void] => {
  const [currentTheme, setCurrentTheme] = useRecoilState(theme)
  
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') as Theme
    setCurrentTheme({
      value: localTheme ? localTheme : 'light'
    })
    document.body.dataset.theme = localTheme ? localTheme : 'light'
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
