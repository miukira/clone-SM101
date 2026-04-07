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
    for (const id of ['6001', '6002', '6003', '6004']) {
      const url = animatedMap[id]
      assert.ok(url, `missing ${id}`)
      assert.match(url, /animated-brand\/arcade\//)
    }
    const list = [6001, 6002, 6003, 6004].map((provider_id) => ({
      provider_id,
      name: `provider-${provider_id}`,
      image: animatedMap[String(provider_id)],
    }))
    const cards = transformProviderData(list)
    assert.equal(cards.length, 4)
    cards.forEach((c) => assert.match(c.logoImg, /animated-brand\/arcade\//))
  })
})
