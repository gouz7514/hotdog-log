import { colors } from "./colors"

export const theme = {
  light: {
    bgColor: colors.background.dark,
    fontColor: colors.white,
  },
  dark: {
    bgColor: colors.background.light,
    fontColor: colors.black,
  }
}

export type MainTheme = typeof theme.light