const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = 'src/content/posts';
const readmePath = 'README.md';

const getAllPosts = (directory) => {
  const files = fs.readdirSync(directory);
  const allPostData = files.map((file) => {
    const id = file.replace(/\.md$/, '');

    const fullPath = path.join(directory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    }
  })
  
  return allPostData.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  })
};

const START_POSTS = '<!-- START_POSTS -->';
const END_POSTS = '<!-- END_POSTS -->';
const POST_TITLE = '### Posts';
const TABLE_HEADER = '| # | Title | Date |'
const TABLE_SEPARATOR = '|---|-------|------|'

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const BASE_URL = 'https://hotjae.com';

const getNowDate = () => {
  const date = new Date();
  const 년 = date.getFullYear();
  const 월 = date.getMonth() + 1;
  const 일  = date.getDate();
  const 요일 = date.getDay();
  const 시 = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const 분 = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${년}-${월}-${일} (${DAYS[요일]}), ${시}:${분} 기준`;
}

const getPostDate = (date) => {
  const newDate = new Date(date);
  const 년 = newDate.getFullYear();
  const 월 = newDate.getMonth() + 1;
  const 일  = newDate.getDate();
  const 요일 = newDate.getDay();

  return `${년}-${월}-${일} (${DAYS[요일]})`;
}

const getPostLink = (id) => {
  return `${BASE_URL}/posts/${id}`;
}

const updateReadme = () => {
  const posts = getAllPosts(postsDirectory);

  // Read current README content
  let readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const startIdx = readmeContent.indexOf(START_POSTS);
  const endIdx = readmeContent.indexOf(END_POSTS);

  let postsTable = posts.map((post, idx) => {
    const { title, date, id } = post;
    return `| ${idx + 1} | [${title}](${getPostLink(id)}) | ${getPostDate(date)} |`
  }).join('\n');

  postsTable = `${POST_TITLE}\n${getNowDate()}\n${TABLE_HEADER}\n${TABLE_SEPARATOR}\n${postsTable}`

  // Replace README content
  if (startIdx === -1 || endIdx === -1) {
    readmeContent += `\n\n${START_POSTS}\n${postsTable}\n${END_POSTS}`;
  } else {
    readmeContent = `${readmeContent.slice(0, startIdx + START_POSTS.length)}\n${postsTable}\n${readmeContent.slice(endIdx)}`;
  }

  // Write new README
  fs.writeFileSync(readmePath, readmeContent);
};

updateReadme();
