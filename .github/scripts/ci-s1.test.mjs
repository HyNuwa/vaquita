import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

const workflow = readFileSync(new URL('../workflows/ci.yml', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
function branches(event) {
  const line = workflow.match(new RegExp(`^  ${event}:\\n    branches: \\[(.+)\\]$`, 'm'));
  assert.ok(line, `Expected explicit branch list for ${event}`);
  return line[1].split(',').map(value => value.trim().replace(/^['"]|['"]$/g, ''));
}

test('PR CI includes only the S1 feature namespace beyond protected bases', () => {
  assert.deepEqual(branches('pull_request'), ['staging', 'main', 'feat/fund-s1-*']);
});

test('existing protected-base and push routing remains intact', () => {
  assert.deepEqual(branches('pull_request').slice(0, 2), ['staging', 'main']);
  assert.deepEqual(branches('push'), ['staging', 'main']);
  assert.match(workflow, /^permissions:\n  contents: read\n/m);
});
