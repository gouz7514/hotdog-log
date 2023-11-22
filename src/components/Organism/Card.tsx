import styled from '@emotion/styled'
import Image from 'next/image'

import Badge from '@/components/Badge'

import { CardProps } from '@/types/types'
import { colors } from '@/styles/colors'

const CardStyle = styled.div`
  --image-height: 200px;

  width: 100%;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 8px;
  overflow: hidden;
  color: ${colors.black};

  &:hover {
    cursor: pointer;
    transform: translateY(-4px);
    transition: all 0.3s ease-in-out;
  }

  .card-image {
    height: var(--image-height);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.white};

    @media screen and (max-width: 600px) {
      height: 300px;
    }
  }

  .card-description {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - var(--image-height));
    gap: 4px;
    padding: 12px 12px 6px;
    background-color: ${colors.lightblue};

    .card-title {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .card-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .card-period {
      bottom: 8px;
      right: 8px;
      margin-top: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: right;
    }
  }
`

export default function Card({ image, title, tags, period }: CardProps) {
  return (
    <CardStyle>
      <div className="card-image">
        <Image
          src={image}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          alt={title}
          placeholder="blur"
        />
      </div>
      <div className="card-description">
        <div className="card-info">
          <div className="card-title">{ title }</div>
          <div className="card-tags">
            {
              tags!.map((tag, idx) => {
                return <Badge key={idx} content={tag} size="small" />
              })
            }
          </div>
        </div>
        <div className='card-period'>{ period }</div>
      </div>
    </CardStyle>
  )
}