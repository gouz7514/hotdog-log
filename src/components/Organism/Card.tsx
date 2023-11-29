import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { StaticImageData } from "next/image"

import Badge from '@/components/Molecule/Badge'

const CardStyle = styled.div`
  --image-height: 200px;

  width: 100%;
  height: 100%;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 8px;
  overflow: hidden;
  color: var(--color-black);

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
    background-color: var(--color-white);
  }

  .card-description {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    padding: 12px 12px 6px;
    background-color: var(--color-lightblue);

    @media screen and (min-width: 600px) {
      height: calc(100% - var(--image-height));
    }

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

interface CardProps {
  image: StaticImageData,
  title: string,
  tags?: Array<string> | undefined,
  period?: string,
  type?: string,
  route?: {
    type: string,
    path: string
  }
}
type CardImageProps = Pick<CardProps, 'image'>
type CardDescriptionProps = Pick<CardProps, 'title' | 'tags' | 'period'>

const CardImage = ({ image }: CardImageProps) => {
  return (
    <div className="card-image">
      <Image
        src={image}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        alt="card-image"
        placeholder="blur"
      />
    </div>
  )
}

const CardDescription = ({ title, tags, period }: CardDescriptionProps) => {
  return (
    <div className="card-description">
      <div className="card-info">
        <div className="card-title">{ title }</div>
        <div className="card-tags">
          {
            tags && tags.map((tag, index) => (
              <Badge
                key={index}
                content={tag}
                className="badge-primary"
                size="small"
              />
            ))
          }
        </div>
      </div>
      <div className='card-period'>{ period }</div>
    </div>
  )
}

export default function Card({ image, title, tags, period, route }: CardProps) {
  const { type: routeType, path: routePath } = route!
  const isExternal = routeType === 'external'

  return (
    <Link href={routePath} target={isExternal ? '_blank' : ''}>
      <CardStyle className={isExternal ? 'external' : ''}>
      {
        isExternal && (
          <span className="curtain">바로가기</span>
        )
      }
      <CardImage image={image} />
      <CardDescription title={title} tags={tags} period={period} />
    </CardStyle>
    </Link>
  )
}