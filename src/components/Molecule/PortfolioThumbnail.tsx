import Image from 'next/image'

interface PortfolioThumbnailProps {
  title: string
  image?: string
  className?: string
}

// 이미지가 없는 프로젝트는 터미널 느낌의 텍스트 타일로 대신한다
export function PortfolioThumbnail({
  title,
  image,
  className = '',
}: PortfolioThumbnailProps) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-[12%] bg-black ${className}`}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[1.4rem] text-white">
          $ {title}
        </span>
      )}
    </div>
  )
}
