import { atom } from 'recoil'

export type Theme = {
  value: string
}

export const initialThemeState: Theme = {
  value: 'light'
}

export const theme = atom({
  key: 'themeState',
  default: initialThemeState
})