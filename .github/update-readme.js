const fs = require('fs');
const path = require('path');

const postsDirectory = 'src/content/posts';
const readmePath = 'README.md';

const getMarkdownFiles = (directory) => {
  const files = fs.readdirSync(directory);
  return files.filter((file) => file.endsWith('.md'));
};

const generateMarkdownList = (files) => {
  return files.map((file) => `- [${file.replace('.md', '')}](${path.join(postsDirectory, file)})`).join('\n');
};

const updateReadme = () => {
  const markdownFiles = getMarkdownFiles(postsDirectory);
  const markdownList = generateMarkdownList(markdownFiles);

  const readmeContent = `# My Project

List of Posts:
${markdownList}
`;

  fs.writeFileSync(readmePath, readmeContent);
};

updateReadme();
