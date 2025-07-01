import fs from 'fs';
import path from 'path';

const dir = './src';
const jsxFiles = [];

function scanDir(folder) {
  const items = fs.readdirSync(folder);

  for (const item of items) {
    const fullPath = path.join(folder, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (item.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<') && content.includes('return')) {
        jsxFiles.push(fullPath);
      }
    }
  }
}

scanDir(dir);

console.log('📦 Arquivos .js que provavelmente usam JSX e devem ser renomeados para .jsx:');
jsxFiles.forEach((file) => console.log('📝', file));