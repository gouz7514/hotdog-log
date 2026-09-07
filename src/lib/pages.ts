import fs from 'fs'
import path from 'path'

import directoryToHtml from './directoryToHtml'
import { Locale } from './translations'

const pagesDirectory = path.join(process.cwd(), 'src/content/pages')

export async function getPageData(id: string, locale: Locale = 'ko') {
  const koDirectory = path.join(pagesDirectory, 'ko')
  const enDirectory = path.join(pagesDirectory, 'en')

  const enFilePath = path.join(enDirectory, `${id}.md`)

  // 영어 버전이 있으면 영어 버전을, 없으면 한국어 버전을 사용
  const targetDirectory =
    locale === 'en' && fs.existsSync(enFilePath) ? enDirectory : koDirectory

  return directoryToHtml(targetDirectory, id)
}
