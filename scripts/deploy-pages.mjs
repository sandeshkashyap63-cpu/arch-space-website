#!/usr/bin/env node
/**
 * Publishes the built site to the gh-pages branch.
 *
 * GitHub Pages is configured to "deploy from branch: gh-pages", so this is the
 * whole deployment: build with the sub-path config, then replace the branch's
 * contents with dist/ and push.
 *
 * A GitHub Actions workflow would be the usual choice, but the local gh token
 * lacks the `workflow` scope, and this keeps deployment reproducible from any
 * machine that can push to the repo.
 *
 * Run: npm run deploy
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(root, 'dist');
const BRANCH = 'gh-pages';

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });
const capture = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', cwd: root, ...opts }).trim();

async function main() {
  // 1. Build with the GitHub Pages configuration.
  console.log('› building for GitHub Pages');
  run('npm', ['run', 'build:pages']);

  // Pages must not run the output through Jekyll — underscore-prefixed paths
  // and some directories would be skipped.
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  // 2. Stage dist/ into a temporary worktree on the gh-pages branch.
  const remote = capture('git', ['remote', 'get-url', 'origin']);
  const message = `Deploy site — ${capture('git', ['rev-parse', '--short', 'HEAD'])}`;
  const work = await fs.mkdtemp(path.join(os.tmpdir(), 'tcp-site-pages-'));

  console.log(`› publishing to ${BRANCH}`);
  run('git', ['init', '-q', '-b', BRANCH], { cwd: work });
  run('git', ['remote', 'add', 'origin', remote], { cwd: work });
  await fs.cp(DIST, work, { recursive: true });
  run('git', ['add', '-A'], { cwd: work });
  run('git', ['commit', '-q', '-m', message], { cwd: work });
  run('git', ['push', '-q', '--force', 'origin', BRANCH], { cwd: work });
  await fs.rm(work, { recursive: true, force: true });

  console.log(`\n✓ deployed. Pages will refresh within a minute or two.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
