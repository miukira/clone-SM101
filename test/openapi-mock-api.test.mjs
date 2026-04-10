/**
 * Integrasi mock Express vs kontrak paths di openapi.yaml.
 * Respons JSON 200/400 yang punya skema di spec divalidasi penuh dengan AJV.
 */
import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import request from 'supertest'
import {
  assertOpenApiDocumentValid,
  assertErrorBodyMatchesOpenApi,
  assertResponseMatchesOpenApi,
  loadOpenApiDereferenced,
} from './helpers/openapiAjv.mjs'

const require = createRequire(import.meta.url)
const { app } = require('../mock-server/server.js')

const BASE = '/api/v1'

/**
 * @param {import('supertest').TestAgent} agent
 * @param {object} spec
 */
async function loginAsUser1(agent, spec) {
  const res = await agent.post(`${BASE}/login`).send({ username: 'user1', password: '1234' }).expect(200)
  assertResponseMatchesOpenApi(spec, '/login', 'post', 200, res.body)
  assert.ok(typeof res.body.token === 'string' && res.body.token.length > 0)
  assert.equal(res.body.username, 'user1')
  assert.equal(res.body.currency, 'IDR')
  assert.ok(Number.isFinite(Number(res.body.balance)))
  return res.body.token
}

describe('OpenAPI — mock server (/api/v1) selaras openapi.yaml', () => {
  /** @type {import('supertest').TestAgent} */
  let agent
  /** @type {object} */
  let spec

  before(async () => {
    await assertOpenApiDocumentValid()
    spec = await loadOpenApiDereferenced()
    agent = request.agent(app)
  })

  describe('Auth', () => {
    it('POST /login 200 + token', async () => {
      await loginAsUser1(agent, spec)
    })

    it('POST /login 400 kredensial salah', async () => {
      const res = await agent.post(`${BASE}/login`).send({ username: 'user1', password: 'salah' }).expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.ok(res.body.message)
    })

    it('POST /register 400 username sudah ada', async () => {
      const res = await agent
        .post(`${BASE}/register`)
        .send({
          username: 'user1',
          password: 'x',
          handphone: '081111111111',
          bank_name: 'bca',
          bank_account: 'x',
          bank_number: '9999999999999',
        })
        .expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.ok(String(res.body.message).length > 0)
    })
  })

  describe('Availability checks', () => {
    it('GET /check-username → { available }', async () => {
      const res = await agent.get(`${BASE}/check-username`).query({ username: 'user1' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/check-username', 'get', 200, res.body)
      assert.equal(res.body.available, false)
    })

    it('GET /check-phone-number → { available }', async () => {
      const res = await agent.get(`${BASE}/check-phone-number`).query({ number: '081999333444' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/check-phone-number', 'get', 200, res.body)
      assert.equal(res.body.available, false)
    })

    it('GET /check-bank-number → { available }', async () => {
      const res = await agent.get(`${BASE}/check-bank-number`).query({ number: '01010007777088081' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/check-bank-number', 'get', 200, res.body)
      assert.equal(res.body.available, false)
    })
  })

  describe('Website (publik)', () => {
    it('GET /info → WebsiteInfo + extended fields', async () => {
      const res = await agent.get(`${BASE}/info`).expect(200)
      assertResponseMatchesOpenApi(spec, '/info', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body.notification))
      assert.ok(Array.isArray(res.body.lottery_result))
      assert.ok(Array.isArray(res.body.withdraw_list))
      assert.ok(res.body.config && typeof res.body.config === 'object')
      assert.ok(Array.isArray(res.body.banks))
    })

    it('GET /website tanpa domain → 400', async () => {
      const res = await agent.get(`${BASE}/website`).expect(400)
      assert.ok(res.body.message)
    })

    it('GET /website?domain= → WebsiteConfig', async () => {
      const res = await agent.get(`${BASE}/website`).query({ domain: 'localhost' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/website', 'get', 200, res.body)
      assert.ok(typeof res.body.title === 'string')
    })

    it('GET /bank-list → array Bank', async () => {
      const res = await agent.get(`${BASE}/bank-list`).expect(200)
      assertResponseMatchesOpenApi(spec, '/bank-list', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body.length > 0)
      assert.ok('id' in res.body[0] && 'name' in res.body[0])
    })

    it('GET /referral', async () => {
      const res = await agent.get(`${BASE}/referral`).expect(200)
      assertResponseMatchesOpenApi(spec, '/referral', 'get', 200, res.body)
      assert.ok(res.body)
    })

    it('GET /promo → Promotion[]', async () => {
      const res = await agent.get(`${BASE}/promo`).expect(200)
      assertResponseMatchesOpenApi(spec, '/promo', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body[0].id != null && res.body[0].title)
    })

    it('GET /theme → ThemeSettings', async () => {
      const res = await agent.get(`${BASE}/theme`).expect(200)
      assertResponseMatchesOpenApi(spec, '/theme', 'get', 200, res.body)
      assert.ok(typeof res.body.season === 'string')
      assert.ok(typeof res.body.background_color === 'string')
    })
  })

  describe('Game providers (GET array Provider)', () => {
    for (const apiPath of [
      '/slot',
      '/fish',
      '/casino',
      '/sportsbook',
      '/togel',
      '/arcade',
      '/crush',
      '/esports',
      '/poker',
      '/cockfight',
    ]) {
      it(`GET ${apiPath} → 200 array`, async () => {
        const res = await agent.get(`${BASE}${apiPath}`).expect(200)
        assertResponseMatchesOpenApi(spec, apiPath, 'get', 200, res.body)
        assert.ok(Array.isArray(res.body))
        assert.ok(res.body.length > 0)
        assert.ok(res.body[0].provider_id != null && res.body[0].name)
      })
    }
  })

  describe('Game list & play', () => {
    it('GET /game-list tanpa provider_id → 400/404 dari Express', async () => {
      const res = await agent.get(`${BASE}/game-list`)
      assert.ok(res.status === 400 || res.status === 404)
    })

    it('GET /game-list?provider_id=9999 → 400 provider not found', async () => {
      const res = await agent.get(`${BASE}/game-list`).query({ provider_id: '9999' }).expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.match(String(res.body.message), /provider/i)
    })

    it('GET /game-list?provider_id=1001 → Game[]', async () => {
      const res = await agent.get(`${BASE}/game-list`).query({ provider_id: '1001' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/game-list', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body[0].id != null && res.body[0].name)
    })

    it('GET /play tanpa auth → 400 please login (sesuai contoh OpenAPI)', async () => {
      const res = await agent
        .get(`${BASE}/play`)
        .query({ provider_id: '1001', game_id: '1' })
        .expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.match(String(res.body.message), /login/i)
    })
  })

  describe('User (Bearer)', () => {
    let token

    before(async () => {
      token = await loginAsUser1(agent, spec)
    })

    it('GET /profile 401 tanpa token', async () => {
      await request(app).get(`${BASE}/profile`).expect(401)
    })

    it('GET /profile 200', async () => {
      const res = await agent.get(`${BASE}/profile`).set('Authorization', `Bearer ${token}`).expect(200)
      assertResponseMatchesOpenApi(spec, '/profile', 'get', 200, res.body)
      assert.equal(res.body.username, 'user1')
      assert.ok(res.body.bank_name)
    })

    it('GET /balance 200', async () => {
      const res = await agent.get(`${BASE}/balance`).set('Authorization', `Bearer ${token}`).expect(200)
      assertResponseMatchesOpenApi(spec, '/balance', 'get', 200, res.body)
      assert.ok(Number.isFinite(Number(res.body.balance)))
    })

    it('GET /balance-mutation 200 array', async () => {
      const res = await agent.get(`${BASE}/balance-mutation`).set('Authorization', `Bearer ${token}`).expect(200)
      assertResponseMatchesOpenApi(spec, '/balance-mutation', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
    })

    it('POST /change-password 400 password salah', async () => {
      const res = await agent
        .post(`${BASE}/change-password`)
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'salah', new_password: 'x' })
        .expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.ok(res.body.message)
    })

    it('POST /theme 401 tanpa token', async () => {
      const res = await request(app).post(`${BASE}/theme`).send({ season: 'none' }).expect(401)
      assertErrorBodyMatchesOpenApi(spec, res.body)
    })

    it('POST /theme 200 (Bearer)', async () => {
      const res = await agent
        .post(`${BASE}/theme`)
        .set('Authorization', `Bearer ${token}`)
        .send({ border_color: '#1E90FF' })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/theme', 'post', 200, res.body)
      assert.equal(res.body.message, 'success')
    })

    it('GET /user-promo 401 tanpa token', async () => {
      await request(app).get(`${BASE}/user-promo`).expect(401)
    })

    it('GET /user-promo 200 PromoCode[]', async () => {
      const res = await agent.get(`${BASE}/user-promo`).set('Authorization', `Bearer ${token}`).expect(200)
      assertResponseMatchesOpenApi(spec, '/user-promo', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body[0].name && res.body[0].code)
    })

    it('GET /user-referral 200 ReferralData', async () => {
      const res = await agent.get(`${BASE}/user-referral`).set('Authorization', `Bearer ${token}`).expect(200)
      assertResponseMatchesOpenApi(spec, '/user-referral', 'get', 200, res.body)
      assert.ok(res.body.referral)
      assert.ok(Array.isArray(res.body.downline))
    })

    it('POST /deposit + GET /deposit-status', async () => {
      const res = await agent
        .post(`${BASE}/deposit`)
        .set('Authorization', `Bearer ${token}`)
        .send({ bank_id: 1, amount: 50000 })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/deposit', 'post', 200, res.body)
      assert.ok(res.body.deposit_id != null)
      assert.ok(res.body.amount === 50000)
      const st = await agent
        .get(`${BASE}/deposit-status`)
        .set('Authorization', `Bearer ${token}`)
        .query({ deposit_id: res.body.deposit_id })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/deposit-status', 'get', 200, st.body)
      assert.ok(['success', 'pending', 'fails'].includes(st.body.status))
    })

    it('GET /play dengan token → { game_url }', async () => {
      const res = await agent
        .get(`${BASE}/play`)
        .set('Authorization', `Bearer ${token}`)
        .query({ provider_id: '1001', game_id: '1' })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/play', 'get', 200, res.body)
      assert.ok(typeof res.body.game_url === 'string' && res.body.game_url.startsWith('http'))
    })

    it('POST /withdraw → WithdrawResponse', async () => {
      const res = await agent
        .post(`${BASE}/withdraw`)
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 1000 })
      if (res.status === 400 && String(res.body?.message || '').includes('pending')) {
        return
      }
      assert.equal(res.status, 200)
      assertResponseMatchesOpenApi(spec, '/withdraw', 'post', 200, res.body)
      assert.ok(res.body.withdraw_id != null)
      const st = await agent
        .get(`${BASE}/withdraw-status`)
        .set('Authorization', `Bearer ${token}`)
        .query({ withdraw_id: res.body.withdraw_id })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/withdraw-status', 'get', 200, st.body)
      assert.ok(['success', 'pending', 'fails'].includes(st.body.status))
    })
  })

  describe('Lottery', () => {
    let token

    before(async () => {
      token = await loginAsUser1(agent, spec)
    })

    it('GET /market-info singapore + type 4d → 200', async () => {
      const res = await agent.get(`${BASE}/market-info`).query({ market: 'singapore', type: '4d' }).expect(200)
      assertResponseMatchesOpenApi(spec, '/market-info', 'get', 200, res.body)
    })

    it('GET /market-info pasar tidak ada → 400', async () => {
      const res = await agent.get(`${BASE}/market-info`).query({ market: 'nope', type: '4d' }).expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.ok(res.body.message)
    })

    it('GET /bet-history 401 tanpa token', async () => {
      await request(app).get(`${BASE}/bet-history`).query({ market: 'singapore' }).expect(401)
    })

    it('GET /bet-history 400 market tidak ada', async () => {
      const res = await agent
        .get(`${BASE}/bet-history`)
        .set('Authorization', `Bearer ${token}`)
        .query({ market: 'unknown-market-xyz' })
        .expect(400)
      assertErrorBodyMatchesOpenApi(spec, res.body)
      assert.ok(res.body.message)
    })

    it('POST /bet 401 tanpa token', async () => {
      await request(app)
        .post(`${BASE}/bet`)
        .send([
          {
            market: 'singapore',
            type: '4D',
            number: '1,2,3,4',
            amount: 100,
            pay: 100,
            prize: 9000,
            discount: false,
            position: 'full',
          },
        ])
        .expect(401)
    })

    it('POST /bet 200', async () => {
      const body = [
        {
          market: 'singapore',
          type: '4D',
          number: '1,2,3,4',
          amount: 100,
          pay: 100,
          prize: 9000,
          discount: false,
          position: 'full',
        },
      ]
      const res = await agent.post(`${BASE}/bet`).set('Authorization', `Bearer ${token}`).send(body).expect(200)
      assertResponseMatchesOpenApi(spec, '/bet', 'post', 200, res.body)
      assert.equal(res.body.message, 'success')
    })

    it('GET /bet-history singapore → array', async () => {
      const res = await agent
        .get(`${BASE}/bet-history`)
        .set('Authorization', `Bearer ${token}`)
        .query({ market: 'singapore' })
        .expect(200)
      assertResponseMatchesOpenApi(spec, '/bet-history', 'get', 200, res.body)
      assert.ok(Array.isArray(res.body))
    })
  })
})
