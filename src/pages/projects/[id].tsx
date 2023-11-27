import MarkdownLayout from "@/components/Template/MarkdownLayout"
import { getAllProjectIds, getProjectData } from "@/lib/project"

export default function Posts({ projects }: any) {
  return (
    <MarkdownLayout
      title={projects.title}
      innerHtml={projects.contentHtml}
    />
  )
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