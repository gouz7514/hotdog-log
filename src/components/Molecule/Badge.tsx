import styled from '@emotion/styled'

interface BadgeProps {
  content: string | number
  className?: string | ''
  link?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: (e: any) => void
  active?: boolean
}

const BadgeContent = styled.div`
  display: flex;
  align-items: center;
  cursor: ${(props) => props.onClick ? 'pointer' : 'default'};

  &.active {
    filter: brightness(0.75);
    transform: translateY(1px);
    transition: all 0.3s ease-in-out;
  }

  .content {
    display: inline-block;
    padding: 4px 8px 2px;
    text-align: center;
    border-radius: 4px;
    min-width: 24px;
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.size-small {
      font-size: 0.9rem;
      font-weight: 600;
    }

    &.size-large {
      font-size: 1.2rem;
    }
  }

  .badge-primary {
    background-color: var(--color-badge-primary);
  }

  .badge-default {
    background-color: var(--color-badge-default);
  }

  .badge-minor {
    background-color: var(--color-badge-minor);
  }
`

export default function Badge({ content, className, link, size = 'medium', onClick, active = false }: BadgeProps) {
  return (
    <BadgeContent onClick={onClick} className={active ? 'active' : ''}>
      { link ? 
        <a href={link} target="blank" className='content badge-primary'>{ content }</a> :
        <div className={`content ${className ? className : 'badge-primary'} size-${size}`}>
          { content }
        </div>
      }
    </BadgeContent>
  )
}