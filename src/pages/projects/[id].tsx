import MarkdownLayout from "@/components/Template/MarkdownLayout"
import { getAllProjectIds, getProjectData } from "@/lib/project"

interface ProjectProps {
  title: string
  contentHtml: string
}

export default function Project({ project }: { project: ProjectProps }) {
  return (
    <MarkdownLayout
      title={project.title}
      innerHtml={project.contentHtml}
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
export async function getStaticProps({ params }: { params: { id: string } }) {
  const project = await getProjectData(params.id)

  return {
    props: {
      project
    }
  }
}