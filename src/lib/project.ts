import fs from 'fs'
import path from 'path'

import directoryToHtml from './directoryToHtml'

const postsDirectory = path.join(process.cwd(), 'src/content/projects')

export function getAllProjectIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName: string) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getProjectData(id: string) {
  return directoryToHtml(postsDirectory, id)
}
