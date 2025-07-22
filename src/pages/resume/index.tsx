import Head from 'next/head'
import React, { useEffect, useState } from 'react'

export default function ResumePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>핫재의 개발 블로그 | 이력서</title>
        <meta name="title" content="핫재의 개발 블로그 | 이력서" />
        <meta
          name="description"
          content="Proactive and Passionate Engineer, Hakjae Kim"
        />
        <meta property="og:title" content="핫재의 개발 블로그 | 이력서" />
        <meta property="og:url" content="https://hotjae.com/resume" />
        <meta
          property="og:description"
          content="Proactive and Passionate Engineer, Hakjae Kim"
        />
      </Head>
      <div>
        <iframe
          src="/resume.pdf"
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Resume PDF"
        >
          This browser does not support PDFs. Please download the PDF to view
          it: <a href="/resume.pdf">Download PDF</a>.
        </iframe>
      </div>
    </>
  )
}

ResumePage.getLayout = (page: React.ReactNode) => page
