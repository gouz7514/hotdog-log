import styled from '@emotion/styled'

interface BadgeProps {
  content: string | number
  className?: string | ''
  link?: string
  size?: 'small' | 'medium' | 'large'
}

const BadgeContent = styled.div`
  display: flex;
  align-items: center;

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

export default function Badge({ content, className, link, size = 'medium' }: BadgeProps) {
  return (
    <BadgeContent>
      { link ? 
        <a href={link} target="blank" className='content badge-primary'>{ content }</a> :
        <div className={`content ${className ? className : 'badge-primary'} size-${size}`}>
          { content }
        </div>
      }
    </BadgeContent>
  )
}