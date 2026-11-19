import assert from 'node:assert/strict';
import test from 'node:test';
import { findLatestTags } from './check-docker-pin.mjs';

test('flags @latest scaffolder tags', () => {
  assert.deepEqual(findLatestTags('RUN npx --yes create-next-app@latest app'), ['@latest']);
  assert.deepEqual(findLatestTags('FROM node:22-alpine@sha256:abc\nRUN npx --yes create-next-app@16.4.6 app'), []);
});

test('ignores pinned digests and unrelated latest text', () => {
  const dockerfile = 'FROM node:22-alpine@sha256:abc\n# never use latest\nRUN npx --yes create-next-app@16.4.6 app\n';
  assert.deepEqual(findLatestTags(dockerfile), []);
});
