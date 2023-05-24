import { GetServerSideProps } from "next"
import prisma from "../../lib/prisma"
import { ProjectTypes } from "../../types/types"

type SimplePostProps = {
  project: ProjectTypes | null;
};

export default function SingleProject({ project }: SimplePostProps) {
  return (
    <>
      <div>{project?.title}</div>
      <div>{project?.content}</div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const project = await prisma.project.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  return {
    props: {
      project
    },
  }
}
