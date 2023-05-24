import { GetStaticProps } from "next"
import Router from 'next/router'

import LoadingLayout from "../../../components/layout/LoadingLayout"
import Post from '../../../components/Post'
import prisma from "../../lib/prisma"
import { ProjectTypes } from '../../types/types'

import AnimationHotdog from '../../../public/lottie/lottie-hotdog.json'
import LottieAnimation from "../../../components/Lottie"

interface ProjectsProps {
  projects: ProjectTypes[]
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <LoadingLayout>
      <div className='container'>
        <div>
          <LottieAnimation json={AnimationHotdog} description="아직 준비중인 페이지입니다. 조금만 기다려주세요!" />
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