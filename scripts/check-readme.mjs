import fs from 'node:fs';
const readme = fs.readFileSync('README.md', 'utf8');
const blocks = [
  ...readme.matchAll(/<!-- source:([^\s]+) -->\n```\w+\n([\s\S]*?)```\n<!-- \/source -->/g),
];
if (blocks.length !== 2) {
  throw new Error('Expected two runnable README excerpts');
}
for (const [, file, source] of blocks) {
  if (source !== fs.readFileSync(file, 'utf8')) {
    throw new Error(`README excerpt is stale: ${file}`);
  }
}
console.log('README excerpts match runnable sources.');
