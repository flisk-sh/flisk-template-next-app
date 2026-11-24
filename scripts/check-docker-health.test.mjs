import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import test from 'node:test';

test('Docker health check waits for the homepage to return a successful HTTP response', async (t) => {
  const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');
  const command = /^HEALTHCHECK [^\n]*\bCMD (.+)$/m.exec(dockerfile)?.[1];
  assert.ok(command, 'Dockerfile has a shell-form health check');

  let status = 503;
  const server = createServer((req, res) => {
    res.writeHead(req.url === '/' ? status : 404).end();
  });
  server.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, 'listening');

  async function healthExitCode() {
    const child = spawn('/bin/sh', ['-c', command], {
      env: { ...process.env, PORT: String(server.address().port) },
      stdio: 'ignore',
    });
    return (await once(child, 'exit'))[0];
  }

  assert.equal(await healthExitCode(), 1, 'a listening server returning 503 is unhealthy');
  status = 200;
  assert.equal(await healthExitCode(), 0, 'a successful homepage is healthy');
});
