/**
 * Memastikan batas min deposit/withdraw ditegakkan di server mock — tidak di-bypass
 * hanya dengan mengutak-atik `amount` (nilai, string, bawah min, di atas saldo).
 */
import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import request from 'supertest'
import { assertErrorBodyMatchesOpenApi, assertOpenApiDocumentValid, loadOpenApiDereferenced } from './helpers/openapiAjv.mjs'

const require = createRequire(import.meta.url)
const { app } = require('../mock-server/server.js')

const BASE = '/api/v1'

/**
 * @param {import('supertest').TestAgent} agent
 */
async function loginTestUser(agent) {
  const res = await agent
    .post(`${BASE}/login`)
    .send({ username: 'testuser', password: 'test123' })
    .expect(200)
  assert.equal(res.body.username, 'testuser')
  return res.body.token
}

describe('API — deposit & withdraw limits (tidak bisa di-bypass lewat request)', () => {
  let agent
  let spec
  let token

  before(async () => {
    await assertOpenApiDocumentValid()
    spec = await loadOpenApiDereferenced()
    agent = request.agent(app)
    token = await loginTestUser(agent)
  })

  it('POST /deposit 400 bila jumlah di bawah min (bank e-wallet 20.000) — wajib ditolak server', async () => {
    const res = await agent
      .post(`${BASE}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bank_id: 1, amount: 10_000 })
      .expect(400)
    assertErrorBodyMatchesOpenApi(spec, res.body)
    assert.match(String(res.body?.message || ''), /20 ?000|minimum deposit is 20000|minimum deposit/i, String(res.body?.message))
  })

  it('POST /deposit 400 bila amount bukan angka valid — wajib ditolak server', async () => {
    const res = await agent
      .post(`${BASE}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bank_id: 1, amount: 'not-a-number' })
      .expect(400)
    assertErrorBodyMatchesOpenApi(spec, res.body)
    assert.match(String(res.body?.message || ''), /invalid amount/i, String(res.body?.message))
  })

  it('POST /withdraw 400 bila jumlah di bawah min withdraw (50.000) — wajib ditolak server', async () => {
    const res = await agent
      .post(`${BASE}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1_000 })
      .expect(400)
    assertErrorBodyMatchesOpenApi(spec, res.body)
    assert.match(String(res.body?.message || ''), /50 ?000|minimum withdraw|minimum withdraw is 50000/i, String(res.body?.message))
  })

  it('POST /withdraw 400 bila jumlah melebihi saldo (meskipun ≥ min) — wajib ditolak server', async () => {
    // testuser: saldo 50.000 di seed mock
    const res = await agent
      .post(`${BASE}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1_000_000 })
      .expect(400)
    assertErrorBodyMatchesOpenApi(spec, res.body)
    assert.match(String(res.body?.message || ''), /insufficient|balance/i, String(res.body?.message))
  })

  it('POST /withdraw 400 bila amount bukan angka valid — wajib ditolak server', async () => {
    const res = await agent
      .post(`${BASE}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 'abc' })
      .expect(400)
    assertErrorBodyMatchesOpenApi(spec, res.body)
    assert.match(String(res.body?.message || ''), /invalid amount/i, String(res.body?.message))
  })
})
