import { css } from "@emotion/react"

import BackButton from "@/components/Atom/BackButton";
import { getAllProjectIds, getProjectData } from "@/lib/project"

const ProjectStyle = css`
  a {
    color: var(--color-blue);
    text-decoration: underline;
    font-weight: bold;
  }

  h3 {
    margin-top: 2rem;
  }

  h4 {
    margin-top: 1.5rem;
  } 

  p {
    margin: 1rem 0;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.5;
    list-style: disc;
    margin-left: 1rem;
  }

  strong {
    color: var(--color-blue);
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