import styled from '@emotion/styled'

import { colors } from '@/styles/colors'

const BadgeContent = styled.div`
  display: flex;
  align-items: center;

  .content {
    display: inline-block;
    padding: 4px 8px 0;
    text-align: center;
    border-radius: 8px;
    min-width: 24px;
    font-weight: 700;
    color: ${colors.white};
  }

  .badge-primary {
    background-color: ${colors.badge.primary};
  }

  .badge-default {
    background-color: ${colors.badge.default};
  }

  .badge-minor {
    background-color: ${colors.badge.minor};
  }
`

type BadgeProps = {
  content: string | number
  className?: string | ''
  link?: string
}

export default function Badge({ content, className, link }: BadgeProps) {
  return (
    <BadgeContent>
      { link ? 
        <a href={link} target="blank" className='content badge-primary'>{ content }</a> :
        <div className={`content ${className ? className : 'badge-primary'}`}>
          { content }
        </div>
      }
    </BadgeContent>
  )
}