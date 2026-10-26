// Tests for the agent check-in Worker, run with: node --test workers/agent-checkin/test
// A fake KV stands in for Cloudflare, so nothing leaves the machine.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { MAX_LEN } from "../src/index.js";

function fakeKV() {
  const store = new Map();
  return {
    store,
    async put(k, v) { store.set(k, v); },
    async get(k) { return store.get(k) ?? null; },
    async list({ prefix }) { return { keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }; },
  };
}

function req(url, init = {}, cf = { country: "US", asOrganization: "Example Cloud", asn: 64500 }) {
  const r = new Request(url, init);
  Object.defineProperty(r, "cf", { value: cf });
  return r;
}

const BASE = "https://checkin.example.workers.dev";

test("a GET check-in is stored with the declared fields, the user agent, country and network, and no IP", async () => {
  const env = { CHECKINS: fakeKV(), LOG_KEY: "secret" };
  const res = await worker.fetch(req(`${BASE}/checkin?agent=TestBot%201.0&operator=Acme&purpose=reading%20papers`,
    { headers: { "user-agent": "TestBot/1.0", "cf-connecting-ip": "203.0.113.9" } }), env);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Thank you, TestBot 1\.0/);
  assert.equal(env.CHECKINS.store.size, 1);
  const rec = JSON.parse([...env.CHECKINS.store.values()][0]);
  assert.equal(rec.agent, "TestBot 1.0");
  assert.equal(rec.operator, "Acme");
  assert.equal(rec.purpose, "reading papers");
  assert.equal(rec.user_agent, "TestBot/1.0");
  assert.equal(rec.country, "US");
  assert.equal(rec.network, "Example Cloud");
  assert.ok(!JSON.stringify(rec).includes("203.0.113.9"), "the IP address must never be stored");
});

test("a JSON POST check-in is stored", async () => {
  const env = { CHECKINS: fakeKV() };
  const res = await worker.fetch(req(`${BASE}/checkin`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ agent: "PostBot", operator: "Lab", purpose: "testing" }) }), env);
  assert.equal(res.status, 200);
  const rec = JSON.parse([...env.CHECKINS.store.values()][0]);
  assert.equal(rec.agent, "PostBot");
  assert.equal(rec.method, "POST");
});

test("an oversized field is cut to the limit", async () => {
  const env = { CHECKINS: fakeKV() };
  await worker.fetch(req(`${BASE}/checkin?agent=${"a".repeat(MAX_LEN + 500)}`), env);
  const rec = JSON.parse([...env.CHECKINS.store.values()][0]);
  assert.equal(rec.agent.length, MAX_LEN);
});

test("the log is refused without the key and returned with it, newest first", async () => {
  const env = { CHECKINS: fakeKV(), LOG_KEY: "secret" };
  await worker.fetch(req(`${BASE}/checkin?agent=First`), env);
  await new Promise((r) => setTimeout(r, 5));
  await worker.fetch(req(`${BASE}/checkin?agent=Second`), env);
  assert.equal((await worker.fetch(req(`${BASE}/log`), env)).status, 404);
  assert.equal((await worker.fetch(req(`${BASE}/log?key=wrong`), env)).status, 404);
  const ok = await worker.fetch(req(`${BASE}/log?key=secret`), env);
  assert.equal(ok.status, 200);
  const body = await ok.json();
  assert.equal(body.count, 2);
  assert.equal(body.records[0].agent, "Second");
});

test("the root explains how to check in, as text for agents and as a form for browsers", async () => {
  const env = { CHECKINS: fakeKV() };
  const text = await (await worker.fetch(req(`${BASE}/`), env)).text();
  assert.match(text, /checkin\?agent=/);
  const html = await (await worker.fetch(req(`${BASE}/`, { headers: { accept: "text/html" } }), env)).text();
  assert.match(html, /<form method="post" action="\/checkin">/);
});
