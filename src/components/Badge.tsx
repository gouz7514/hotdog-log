import styled from '@emotion/styled'

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
  }

  .badge-primary {
    background-color: #0066cc;
    color: white;
  }

  .badge-default {
    background-color: #33ccff;
    color: white;
  }

  .badge-minor {
    background-color: #cccccc;
    color: white;
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