import { GetStaticProps } from "next"
import LoadingLayout from "../../../components/layout/LoadingLayout"
import prisma from "../../lib/prisma"
import { ProjectTypes } from '../../types/types'
import Post from '../../../components/Post'
import Router from 'next/router'

interface ProjectsProps {
  projects: ProjectTypes[]
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <LoadingLayout>
      <div className='container'>
        <h2>
          Projects
        </h2>
        <div>
          {projects?.map((project) => (
            <div key={project.id} onClick={() => Router.push('/projects/[id]', `/projects/${project.id}`)}>
              <Post post={project} />
            </div>
          ))}
        </div>
      </div>
    </LoadingLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  })
  
  return {
    props: { projects },
    revalidate: 10,
  }
}