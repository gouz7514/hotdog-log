import { css } from "@emotion/react"

import BackButton from "@/components/Atom/BackButton";
import { getAllProjectIds, getProjectData } from "@/lib/project"

const ProjectStyle = css`
  strong {
    color: var(--color-blue);
}

  a {
    color: var(--color-blue);
    text-decoration: underline;
    font-weight: bold;
  }

  h3 {
    margin-top: 2rem;
    color: var(--color-blue);
  }

  h4{
    margin-top: 1.5rem;
  }

  h3 ~ h4 {
    margin-top: 1rem;
  }

  h5 {
    margin-top: 1.3rem;
  }

  p {
    margin: 0.8rem 0;
    white-space: pre-wrap;
    line-height: 1.65;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.5;
    list-style: disc;
    margin-left: 1rem;
    white-space: pre-wrap;
  }

  img {
    display: block;
    width: 100%;
    max-width: 520px;
    margin: 2rem auto 0;

    @media screen and (max-width: 600px) {
      max-width: calc(100% - 40px);
    }
  }
`

export default function Posts({ projects }: any) {
  return (
    <div className="container">
      <BackButton />
        <h2>
          { projects.title }
        </h2>
        <div dangerouslySetInnerHTML={{ __html: projects.contentHtml }} css={ProjectStyle} />
    </div>
  );
}

// return a list of possible value for id
export async function getStaticPaths() {
  const paths = getAllProjectIds()
  return {
    paths,
    fallback: false
  }
}

// fetch necessary data for the blog post using params.id
export async function getStaticProps({ params }: any) {
  const projects = await getProjectData(params.id)

  return {
    props: {
      projects
    }
  }
}