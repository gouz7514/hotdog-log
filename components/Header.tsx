import Link from 'next/link'
import styled from 'styled-components'

const HomeHeader = styled.div`
  font-size: 1.5em;
  color: black;
  font-weight: bold;
  display: flex;
  gap: 16px;
  height: 60px;
  border-bottom: 1px black solid;
  align-items: center;
  background-color: #CDE4B4;
  padding: 8px;

  .header-links {
    border: 1px solid black;
    padding: 8px;
    border-radius: 12px;
  }
`

const NormalHeader = styled.div`
  font-size: 1.2em;
  color: black;
  font-weight: bold;
  display: flex;
  gap: 16px;
  height: 60px;
  border-bottom: 1px black solid;
  align-items: center;
  background-color: #CDE4B4;
  padding: 8px;

  .header-links {
    border: 1px solid black;
    padding: 8px;
    border-radius: 12px;
  }
`

type HeaderProps = {
  page: string
}

export default function Header({ page }: HeaderProps) {
  return (
    <div>
      { page === 'Home' ? 
      (
        <HomeHeader>
          <div>
            <Link href="/">Home</Link>
          </div>
          <div>
            <Link href="/posts">Posts</Link>
          </div>
        </HomeHeader>
      ) : 
      (
        <NormalHeader>
          <div>
            <Link href="/">Home</Link>
          </div>
          <div>
            <Link href="/posts">Posts</Link>
          </div>
        </NormalHeader>
      )}
    </div>
  )
}