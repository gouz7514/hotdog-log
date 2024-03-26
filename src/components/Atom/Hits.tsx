export default function Hits({ id }: { id: string }) {
  const imgSrc = `https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fhotjae.com%2Fposts%2F${id}&count_bg=%230064FF&title_bg=%23282C34&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false`

  return (
    <a href="https://hits.seeyoufarm.com">
      <img src={imgSrc} alt={`${id}-posts-hits`} />
    </a>
  )
}
