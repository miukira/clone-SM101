/**
 * Alur data mock → transform yang dipakai kartu home (tanpa browser).
 * Membutuhkan mock-server di-import seperti test openapi (supertest + app).
 */
import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import request from 'supertest'
import { transformProviderData } from '../src/utils/transformProviderApi.js'

const require = createRequire(import.meta.url)
const { app } = require('../mock-server/server.js')

const BASE = '/api/v1'

describe('Mock GET kategori → transformProviderData (siap untuk ProviderCard)', () => {
  /** @type {import('supertest').TestAgent} */
  let agent

  before(() => {
    agent = request.agent(app)
  })

  for (const { path: apiPath, min } of [
    { path: '/slot', min: 3 },
    { path: '/fish', min: 2 },
    { path: '/casino', min: 2 },
    { path: '/sportsbook', min: 2 },
  ]) {
    it(`GET ${apiPath} + transform → kartu dengan logoImg`, async () => {
      const res = await agent.get(`${BASE}${apiPath}`).expect(200)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body.length >= min)
      const cards = transformProviderData(res.body)
      assert.equal(cards.length, res.body.length)
      const first = cards[0]
      assert.ok(first.provider_id != null)
      assert.ok(first.name)
      assert.ok(typeof first.logoImg === 'string' || first.logoImg === null)
    })
  }
})
