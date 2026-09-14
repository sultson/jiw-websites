import assert from 'node:assert/strict';
import worker, {type Env} from '../worker/index';
let assetCalls = 0;
const env = {ASSETS: {fetch: async () => { assetCalls++; return new Response('not found', {status: 404}); }}} as unknown as Env;
const ctx = {} as ExecutionContext;
for (const url of ['https://winterswijkvakantiehuis.nl/over-ons', 'https://winterswijkvakantiehuis.nl/over-ons/', 'http://www.winterswijkvakantiehuis.nl/over-ons/']) {
  const response = await worker.fetch(new Request(url), env, ctx);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://winterswijkvakantiehuis.nl/#about');
}
assert.equal(assetCalls, 0);
const missing = await worker.fetch(new Request('https://winterswijkvakantiehuis.nl/not-a-real-page'), env, ctx);
assert.equal(missing.status, 404);
assert.equal(assetCalls, 1);
console.log('PASS: retired About page redirects in one hop; unrelated missing pages remain 404. No network calls.');
