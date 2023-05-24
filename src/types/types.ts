export type ProjectTypes = {
  id: string
  title: string
  content?: string | null
  published: boolean
  author?: UserTypes| null
  authorId?: string | null
}

export type UserTypes = {
  id: string
  name?: string | null
  email?: string | null
  createdAt: Date
  updatedAt: Date
  projects: ProjectTypes[]
}