import { colors } from "./colors"

export const theme = {
  light: {
    bgColor: colors.lightTheme.background,
    fontColor: colors.lightTheme.font,
  },
  dark: {
    bgColor: colors.darkTheme.background,
    fontColor: colors.darkTheme.font,
  }
}

export type MainTheme = typeof theme.light