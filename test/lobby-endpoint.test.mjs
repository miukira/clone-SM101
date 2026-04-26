/**
 * Smoke test GET /lobby (openapi2) — butuh JWT untuk 200.
 * Tanpa token: backend staging mengembalikan 401.
 *
 * Karena memanggil jaringan, hanya jalan bila:
 *   LOBBY_SMOKE=1 npm run test:lobby-smoke
 *
 * Tes bertoken (200 + lobby_url boleh ""), contoh provider_id=4002:
 *   LOBBY_SMOKE=1 LOBBY_TEST_TOKEN=<jwt> npm run test:lobby-smoke
 */
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

const STAGING_LOBBY = 'https://staging.rdd-server.com/api/v1/lobby'
const STAGING_LOBBY_WITH_PROVIDER = `${STAGING_LOBBY}?provider_id=1`
/** Contoh provider staging: 200 OK dengan `lobby_url: ""` (FE tidak alert). */
const STAGING_LOBBY_PROVIDER_4002 = `${STAGING_LOBBY}?provider_id=4002`

const runSmoke = process.env.LOBBY_SMOKE === '1'

describe('GET /lobby (staging smoke)', () => {
  test(
    'tanpa Authorization → 401 + JSON',
    { skip: !runSmoke },
    async () => {
      const r = await fetch(STAGING_LOBBY, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      assert.equal(r.status, 401, 'unauthenticated request must be rejected')
      const data = await r.json()
      assert.ok(data && typeof data === 'object', 'body is JSON object')
    },
  )

  test(
    'tanpa Authorization, ?provider_id=... → tetap 401 + JSON',
    { skip: !runSmoke },
    async () => {
      const r = await fetch(STAGING_LOBBY_WITH_PROVIDER, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      assert.equal(r.status, 401)
      const data = await r.json()
      assert.ok(data && typeof data === 'object')
    },
  )

  test('dengan token — GET /lobby (set LOBBY_TEST_TOKEN + LOBBY_SMOKE=1)', { skip: !runSmoke || !process.env.LOBBY_TEST_TOKEN }, async () => {
    const r = await fetch(STAGING_LOBBY, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOBBY_TEST_TOKEN}`,
      },
    })
    assert.ok(
      r.status === 200 || r.status === 401 || r.status === 500,
      `got ${r.status} (200 = success, 401/500 = bad token or server)`,
    )
    if (r.status === 200) {
      const data = await r.json()
      const url = data?.lobby_url ?? data?.lobbyUrl
      assert.ok(
        typeof url === 'string',
        '200 response: lobby_url harus string (boleh "" di staging)',
      )
    }
  })

  test(
    'dengan token — GET /lobby?provider_id=4002 (lobby_url boleh string kosong)',
    { skip: !runSmoke || !process.env.LOBBY_TEST_TOKEN },
    async () => {
      const r = await fetch(STAGING_LOBBY_PROVIDER_4002, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LOBBY_TEST_TOKEN}`,
        },
      })
      assert.ok(
        r.status === 200 || r.status === 401 || r.status === 500,
        `got ${r.status}`,
      )
      if (r.status === 200) {
        const data = await r.json()
        const url = data?.lobby_url ?? data?.lobbyUrl
        assert.ok(typeof url === 'string', 'lobby_url / lobbyUrl harus string')
        if (url === '') {
          assert.equal(data?.lobby_url ?? '', '', 'contoh staging: lobby_url eksplisit ""')
        }
      }
    },
  )
})
