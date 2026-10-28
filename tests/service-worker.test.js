// @ts-nocheck -- Runs in Node with a simulated service-worker environment.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const base = '/polymer-clay-recipe-calculator';
const home = `${base}/`;
const script = readFileSync(new URL('../src/service-worker/index.js', import.meta.url), 'utf8')
  .replace(/^import .* from '\$app\/(?:env|manifest|paths)';$/gm, '');

function harness(network = async () => new Response('online')) {
  const listeners = {};
  const storage = new Map();
  const removed = [];
  let claimed = false;
  const caches = {
    async open(name) {
      if (!storage.has(name)) storage.set(name, new Map());
      const entries = storage.get(name);
      return {
        async addAll(urls) { for (const url of urls) entries.set(url, new Response(`cached:${url}`)); },
        async match(url) { return entries.get(url)?.clone(); },
      };
    },
    async keys() { return [...storage.keys()]; },
    async delete(name) { removed.push(name); return storage.delete(name); },
  };
  const self = {
    location: { origin: 'https://deanwmarx.github.io' },
    registration: { scope: `https://deanwmarx.github.io${home}` },
    clients: { async claim() { claimed = true; } },
    addEventListener(name, callback) { listeners[name] = callback; },
  };
  vm.runInNewContext(script, {
    self, caches, URL, Response, fetch: network, resolve: () => home,
    immutable: [{path:'_app/app.js'}], assets: [{path:'icons/clay-recipes-192.png'}],
    prerendered: [{path:''}], version: 'new',
  });
  return {
    storage, removed, get claimed() { return claimed; },
    async lifecycle(name) { let work; listeners[name]({waitUntil(value) { work = value; }}); await work; },
    async request(path, options = {}) {
      let response;
      listeners.fetch({
        request: { url: new URL(path, self.location.origin).href, method: 'GET', mode: 'cors', ...options },
        respondWith(value) { response = value; },
      });
      return response;
    },
  };
}

test('offline install includes the calculator, icons and code', async () => {
  const worker = harness(async () => { throw Error('offline'); });
  await worker.lifecycle('install');
  assert.equal(await (await worker.request(home, {mode:'navigate'})).text(), `cached:${home}`);
  assert.equal(await (await worker.request(`${base}/_app/app.js`)).text(), `cached:${base}/_app/app.js`);
  assert.equal(await (await worker.request(`${base}/icons/clay-recipes-192.png`)).text(), `cached:${base}/icons/clay-recipes-192.png`);
});

test('online navigation uses the network and unrelated requests pass through', async () => {
  const worker = harness();
  await worker.lifecycle('install');
  assert.equal(await (await worker.request(home, {mode:'navigate'})).text(), 'online');
  assert.equal(await worker.request('/another-tool/'), undefined);
  assert.equal(await worker.request('https://example.com/'), undefined);
  assert.equal(await worker.request(home, {method:'POST'}), undefined);
});

test('cache cleanup preserves caches belonging to the rest of the personal site', async () => {
  const worker = harness();
  await worker.lifecycle('install');
  worker.storage.set(`clay-colour:${base}:old`, new Map());
  worker.storage.set('personal-site-cache', new Map());
  worker.storage.set('clay-colour:/other-tool/:old', new Map());
  await worker.lifecycle('activate');
  assert.deepEqual(worker.removed, [`clay-colour:${base}:old`]);
  assert.ok(worker.storage.has('personal-site-cache'));
  assert.ok(worker.storage.has('clay-colour:/other-tool/:old'));
  assert.ok(worker.claimed);
});
