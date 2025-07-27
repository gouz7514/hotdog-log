import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

import { IconBack } from '../Icon'

import { Icon } from './Icon'

import ThemeContext from '@/context/themeContext'
import { theme } from '@/styles/theme'


const StyleBackButton = styled.div`
  cursor: pointer;
  width: 30px;
`

export function BackButton() {
  const router = useRouter()
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark

  return (
    <StyleBackButton onClick={() => router.back()}>
      <Icon icon={<IconBack isDark={isDark} />} />
    </StyleBackButton>
  )
}
