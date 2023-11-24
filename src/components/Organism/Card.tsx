import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'

import Badge from '@/components/Molecule/Badge'

import { CardProps } from '@/types/types'
import { colors } from '@/styles/colors'

const CardStyle = styled.div`
  --image-height: 200px;

  width: 100%;
  height: 100%;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 8px;
  overflow: hidden;
  color: ${colors.black};

  &.external {
    position: relative;
    overflow: hidden;

    .curtain {
      position: absolute;
      z-index: 1;
      top: 0;
      right: -100%;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
    }

    &:hover .curtain {
      right: 0;
      opacity: 1;
    }
  }

  &:hover {
    cursor: pointer;
    transform: scale(1.03);
    transition: all 0.4s ease-in-out;
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

const CardContent = ({ image, title, tags, period, externalLink }: CardProps) => {
  return (
    <CardStyle className={externalLink && 'external'}>
      {
        externalLink && (
          <span className="curtain">바로가기</span>
        )
      }
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

export default function Card({ image, title, tags, period, externalLink }: CardProps) {
  return (
    <>
      {
        externalLink ? (
          <Link href={externalLink} target='blank'>
            <CardContent
              image={image}
              title={title}
              tags={tags}
              period={period}
              externalLink={externalLink}
            />
          </Link>
        ) : (
          <CardContent
            image={image}
            title={title}
            tags={tags}
            period={period}
          />
        
        )
      }
    </>
  )
}