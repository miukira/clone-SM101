import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { transformProviderData } from '../src/utils/transformProviderApi.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const animatedMap = JSON.parse(
  readFileSync(join(__dirname, '../src/data/provider-mock-animated-images.json'), 'utf8')
)

describe('Provider API response → ProviderCard props', () => {
  it('image string kosong dari API → logoImg/characterImg null (hindari src="")', () => {
    const [card] = transformProviderData([
      { provider_id: 1, name: 'x', image: '', badge: null },
    ])
    assert.equal(card.logoImg, null)
    assert.equal(card.characterImg, null)
  })

  it('transformProviderData memetakan provider_id, name, image, badge', () => {
    const rows = [
      {
        provider_id: 1001,
        name: 'pragmatic-play',
        image: '/animated-brand/slot/slot-pragmatic-play.webp',
        badge: { type: 'hot' },
      },
    ]
    const [card] = transformProviderData(rows)
    assert.equal(card.provider_id, 1001)
    assert.equal(card.id, 1001)
    assert.equal(card.name, 'pragmatic-play')
    assert.equal(card.logoImg, '/animated-brand/slot/slot-pragmatic-play.webp')
    assert.equal(card.characterImg, '/animated-brand/slot/slot-pragmatic-play.webp')
    assert.equal(card.badge.type, 'hot')
    assert.ok(card.display_name.includes('Pragmatic'))
  })

  it('payload mirip GET /slot: image + badge → kartu', () => {
    const pragmaticImage = animatedMap['1001']
    const pgImage = animatedMap['1002']
    assert.ok(pragmaticImage)
    assert.ok(pgImage)

    const list = [
      { provider_id: 1001, name: 'pragmatic-play', image: pragmaticImage, badge: { type: 'hot' } },
      { provider_id: 1002, name: 'pg-soft', image: pgImage, badge: { type: 'new' } },
    ]
    const cards = transformProviderData(list)
    assert.equal(cards.length, 2)
    assert.match(cards[0].logoImg, /animated-brand\/slot\//)
    assert.equal(cards[0].badge?.type, 'hot')
    assert.equal(cards[1].badge?.type, 'new')
  })

  it('arcade: JSON mock mengarah ke animated-brand/arcade', () => {
    const arcadeIds = ['6001', '6002', '6003', '6004', '6005', '6006', '6007', '6008', '6009', '6010']
    for (const id of arcadeIds) {
      const url = animatedMap[id]
      assert.ok(url, `missing ${id}`)
      assert.match(url, /animated-brand\/arcade\//)
    }
    const list = arcadeIds.map((id) => ({
      provider_id: Number(id),
      name: `provider-${id}`,
      image: animatedMap[id],
    }))
    const cards = transformProviderData(list)
    assert.equal(cards.length, arcadeIds.length)
    cards.forEach((c) => assert.match(c.logoImg, /animated-brand\/arcade\//))
  })

  it('crush: JSON mock mengarah ke animated-brand/crush', () => {
    const crushIds = ['9001', '9002', '9003', '9004', '9005', '9006', '9007', '9008', '9009']
    for (const id of crushIds) {
      const url = animatedMap[id]
      assert.ok(url, `missing ${id}`)
      assert.match(url, /animated-brand\/crush\//)
    }
  })

  it('esports: JSON mock mengarah ke animated-brand/esports', () => {
    const esportsIds = ['9101', '9102', '9103']
    for (const id of esportsIds) {
      const url = animatedMap[id]
      assert.ok(url, `missing ${id}`)
      assert.match(url, /animated-brand\/esports\//)
    }
  })
})
