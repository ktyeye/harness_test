import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const targetDirs = ['src', 'test'];
const problems = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!path.endsWith('.js')) continue;
    const content = readFileSync(path, 'utf8');
    if (content.includes('console.log(')) {
      problems.push(`${path}: console.log should not be committed`);
    }
    if (/\s+$/.test(content)) {
      problems.push(`${path}: trailing whitespace found`);
    }
  }
}

for (const dir of targetDirs) walk(dir);

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('lint passed');
