import ImageCloudFront from '../../public/images/resume/image-cloudfront.webp'
import ImageGallery from '../../public/images/resume/image-gallery.webp'
import IamgeVueQuery from '../../public/images/resume/image-vue-query.webp'
import ImageDocker from '../../public/images/resume/image-docker.webp'
import ImageStoryBook from '../../public/images/resume/image-storybook.webp'
import ImageDynoEnglish from '../../public/images/resume/image-dyno-english.webp'
import ImageSubhow from '../../public/images/resume/image-subhow.webp'

export const SKILLS = {
  FE: [
    {
      name: 'Vue',
      score: 3
    },
    {
      name: 'Nuxt',
      score: 3
    },
    {
      name: 'Javascript',
      score: 3
    },
    {
      name: 'React',
      score: 2
    },
    {
      name: 'Next',
      score: 2
    },
    {
      name: 'Typescript',
      score: 2
    },
    {
      name: 'Storybook',
      score: 2
    },
    {
      name: 'Webpack',
      score: 2
    },
    {
      name: 'Graphql',
      score: 1
    },
  ],
  DEVOPS: [
    {
      name: 'AWS',
      score: 3
    },
    {
      name: 'Git',
      score: 3
    },
    {
      name: 'Docker',
      score: 2
    },
  ],
  BE: [
    {
      name: 'Python',
      score: 2
    },
    {
      name: 'Nginx',
      score: 1
    },
    {
      name: 'Django',
      score: 1
    },
  ],
}

export const PROJECTS = [
  {
    id: 1,
    image: ImageCloudFront,
    title: "클라우드 인프라 최적화",
    tags: ["Nuxt", "Webpack", "AWS"],
    period: "2023.04",
    type: "company",
    route: {
      type: "internal",
      path: "/projects/optimize-cloud-infra"
    }
  },
  {
    id: 2,
    image: ImageGallery,
    title: "인포크링크 갤러리 자동화",
    tags: ["AWS", "typescript"],
    period: "2023.03",
    type: "company",
    route: {
      type: "internal",
      path: "/projects/automate-inpocklink-gallery"
    }
  },
  {
    id: 3,
    image: IamgeVueQuery,
    title: "상태 관리를 활용한 성능 개선",
    tags: ["Vue", "Nuxt", "vue-query", "javascript"],
    period: "2022.12 ~ 2023.01",
    type: "company",
    route: {
      type: "internal",
      path: "/projects/performance-improvement-with-vue-query"
    }
  },
  {
    id: 4,
    image: ImageDocker,
    title: "도커를 활용한 서버 구축",
    tags: ["Docker", "AWS", "Nginx", "Django"],
    period: "2021.12 ~ 2022.01",
    type: "company",
    route: {
      type: "internal",
      path: "/projects/create-server-with-docker"
    }
  },
  {
    id: 5,
    image: ImageStoryBook,
    title: "인포크 디자인 시스템 (ids)",
    tags: ["Vue", "Storybook", "javascript"],
    period: "2021.06 ~ 2021.09",
    type: "company",
    route: {
      type: "internal",
      path: "/projects/ids"
    }
  },
  {
    id: 6,
    image: ImageDynoEnglish,
    title: "다이노 영어",
    tags: ["React", "Next.js", "typescript", "firebase", "styled-components"],
    period: "2023.06 ~ 2023.10",
    type: "personal",
    route: {
      type: "external",
      path: "https://github.com/gouz7514/dyno-english"
    },
  },
  {
    id: 7,
    image: ImageSubhow,
    title: "SUBHOW",
    tags: ["React", "Next.js", "typescript", "prisma"],
    period: "2023.05 ~ 2023.16",
    type: "personal",
    route: {
      type: "external",
      path: "https://github.com/gouz7514/subway-website-next"
    },
  }
]