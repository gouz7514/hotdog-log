import styled from '@emotion/styled'

interface ButtonProps {
  size: 'small' | 'medium' | 'large'
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

const BUTTON_PADDING: Record<ButtonProps['size'], string> = {
  small: '8px 12px',
  medium: '12px 16px',
  large: '16px 24px',
}

// Helper function to get padding based on size and variant
const getPadding = (size: ButtonProps['size']) => {
  // do something
  return BUTTON_PADDING[size]
}

export function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>
}

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ size }) => getPadding(size)};
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--color-font);
  color: var(--color-background);
  transition: opacity 0.3s ease;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`
