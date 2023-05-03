import Link from 'next/link'

export default function Resume() {
  return (
    <>
      <div className="container">
        <h1>
          This is Resume page
        </h1>
        <h2>
          <Link href="/">Back to home</Link>
        </h2>
      </div>
    </>
  )
}